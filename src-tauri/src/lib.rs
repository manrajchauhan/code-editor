pub mod commands;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::fs::open_folder_dialog,
            commands::fs::read_directory_tree,
            commands::fs::read_file_content,
            commands::fs::write_file_content,
            commands::fs::create_file_node,
            commands::fs::create_dir_node,
            commands::fs::rename_node,
            commands::fs::copy_node,
            commands::fs::delete_node,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
