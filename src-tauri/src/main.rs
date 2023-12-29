#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod utils;
mod adb;

use crate::utils::set_window_shadow;
use adb::execute_command;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            set_window_shadow(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            execute_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
