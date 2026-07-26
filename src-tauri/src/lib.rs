pub mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::fs::read_directory_tree,
            commands::fs::read_file_content,
            commands::fs::write_file_content,
            commands::fs::create_file_node,
            commands::fs::create_dir_node,
            commands::fs::delete_node,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
