use tauri::menu::{MenuBuilder, SubmenuBuilder, MenuItemBuilder};

pub mod commands;

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();

            let edit_menu = SubmenuBuilder::new(handle, "Edit")
                .undo()
                .redo()
                .separator()
                .cut()
                .copy()
                .paste()
                .select_all()
                .build()?;

            let file_menu = SubmenuBuilder::new(handle, "File")
                .item(&MenuItemBuilder::with_id("save", "Save").accelerator("CmdOrCtrl+S").build(handle)?)
                .separator()
                .close_window()
                .build()?;

            let menu = MenuBuilder::new(handle)
                .items(&[&file_menu, &edit_menu])
                .build()?;

            app.set_menu(menu)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::fs::open_folder_dialog,
            commands::fs::execute_shell_command,
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
