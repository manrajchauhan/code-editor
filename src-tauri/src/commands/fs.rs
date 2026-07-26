use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileNode {
    pub id: String,
    pub name: String,
    pub path: String,
    #[serde(rename = "isDirectory")]
    pub is_directory: bool,
    pub children: Option<Vec<FileNode>>,
    #[serde(rename = "isExpanded")]
    pub is_expanded: Option<bool>,
}

#[tauri::command]
pub async fn open_folder_dialog() -> Result<Option<String>, String> {
    let folder = rfd::AsyncFileDialog::new()
        .set_title("Select Project Folder")
        .pick_folder()
        .await;

    Ok(folder.map(|f| f.path().to_string_lossy().to_string()))
}

#[tauri::command]
pub async fn execute_shell_command(command: String, cwd: String) -> Result<String, String> {
    let active_dir = if cwd.is_empty() {
        ".".to_string()
    } else {
        cwd
    };

    let home = std::env::var("HOME").unwrap_or_default();
    let current_path = std::env::var("PATH").unwrap_or_default();
    let full_path = format!("{}/.cargo/bin:/opt/homebrew/bin:/usr/local/bin:{}", home, current_path);

    let lower_cmd = command.to_lowercase();
    let is_daemon = lower_cmd.contains("dev") || lower_cmd.contains("start") || lower_cmd.contains("serve");

    if is_daemon {
        let mut child = std::process::Command::new("sh")
            .arg("-c")
            .arg(&command)
            .env("PATH", &full_path)
            .current_dir(Path::new(&active_dir))
            .spawn()
            .map_err(|e| format!("Failed to spawn dev process: {}", e))?;

        std::thread::sleep(std::time::Duration::from_millis(600));

        match child.try_wait() {
            Ok(Some(status)) => {
                Ok(format!("Process exited with status: {}\r\n", status))
            }
            Ok(None) => {
                Ok(format!(
                    "\x1b[32m🚀 Started development server process:\x1b[0m {}\r\n\x1b[36m  ➜ Local: http://localhost:1420/\x1b[0m\r\n\x1b[90mRunning continuously in background...\x1b[0m\r\n",
                    command
                ))
            }
            Err(e) => Err(format!("Error checking process status: {}", e)),
        }
    } else {
        let output = std::process::Command::new("sh")
            .arg("-c")
            .arg(&command)
            .env("PATH", full_path)
            .current_dir(Path::new(&active_dir))
            .output()
            .map_err(|e| format!("Failed to execute shell command: {}", e))?;

        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();

        let combined = format!("{}{}", stdout, stderr);
        if combined.trim().is_empty() {
            Ok("Done.\r\n".to_string())
        } else {
            Ok(combined)
        }
    }
}

#[tauri::command]
pub async fn read_directory_tree(path: String) -> Result<FileNode, String> {
    let p = Path::new(&path);
    if !p.exists() {
        return Err("Directory does not exist".to_string());
    }

    let node = read_node_recursive(p)?;
    Ok(node)
}

fn read_node_recursive(path: &Path) -> Result<FileNode, String> {
    let is_dir = path.is_dir();
    let name = path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default();
    let path_str = path.to_string_lossy().to_string();

    let mut children = None;

    if is_dir {
        let mut child_nodes = Vec::new();
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let child_path = entry.path();
                if let Some(child_name) = child_path.file_name() {
                    let s = child_name.to_string_lossy();
                    if s == ".git" {
                        continue;
                    }
                }
                if let Ok(child_node) = read_node_recursive(&child_path) {
                    child_nodes.push(child_node);
                }
            }
        }
        child_nodes.sort_by(|a, b| b.is_directory.cmp(&a.is_directory).then(a.name.cmp(&b.name)));
        children = Some(child_nodes);
    }

    Ok(FileNode {
        id: path_str.clone(),
        name,
        path: path_str,
        is_directory: is_dir,
        children,
        is_expanded: Some(false),
    })
}

#[tauri::command]
pub async fn read_file_content(path: String) -> Result<String, String> {
    let p = Path::new(&path);
    if p.is_dir() {
        return Err("Cannot read content of a directory".to_string());
    }
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
pub async fn write_file_content(path: String, content: String) -> Result<(), String> {
    let p = Path::new(&path);
    if let Some(parent) = p.parent() {
        if !parent.exists() {
            let _ = fs::create_dir_all(parent);
        }
    }
    fs::write(&path, content).map_err(|e| format!("Failed to write file to {}: {}", path, e))
}

#[tauri::command]
pub async fn create_file_node(path: String) -> Result<(), String> {
    let p = Path::new(&path);
    if let Some(parent) = p.parent() {
        if !parent.exists() {
            let _ = fs::create_dir_all(parent);
        }
    }
    fs::File::create(&path).map_err(|e| format!("Failed to create file: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn create_dir_node(path: String) -> Result<(), String> {
    fs::create_dir_all(&path).map_err(|e| format!("Failed to create directory: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn rename_node(old_path: String, new_path: String) -> Result<(), String> {
    fs::rename(&old_path, &new_path).map_err(|e| format!("Failed to rename item: {}", e))
}

#[tauri::command]
pub async fn copy_node(src_path: String, dest_path: String) -> Result<(), String> {
    let src = Path::new(&src_path);
    let dest = Path::new(&dest_path);
    if src.is_dir() {
        copy_dir_all(src, dest).map_err(|e| format!("Failed to copy directory: {}", e))
    } else {
        fs::copy(src, dest)
            .map(|_| ())
            .map_err(|e| format!("Failed to copy file: {}", e))
    }
}

fn copy_dir_all(src: &Path, dest: &Path) -> std::io::Result<()> {
    fs::create_dir_all(dest)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(&entry.path(), &dest.join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dest.join(entry.file_name()))?;
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn delete_node(path: String) -> Result<(), String> {
    let p = Path::new(&path);
    if p.is_dir() {
        fs::remove_dir_all(p).map_err(|e| format!("Failed to delete directory: {}", e))
    } else {
        fs::remove_file(p).map_err(|e| format!("Failed to delete file: {}", e))
    }
}
