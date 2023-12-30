use std::process::Command;

#[tauri::command]
pub async fn execute_command(command: String) -> Result<String, String> {
    println!("{}", command);
    let parts: Vec<String> = command
        .trim()
        .split(';')
        .map(|s| s.to_string())
        .collect();
    let mut cmd = Command::new("adb");
    // cmd.arg("wait-for-device");
    for arg in parts {
        cmd.arg(arg);
    }
    let output = cmd
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;
    let stdout = String::from_utf8(output.stdout).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;

    let stderr = String::from_utf8(output.stderr).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;
    let result_str: String = stdout + "&" + &stderr;
    println!("{}", result_str);
    println!("{}", stderr);
    Ok(result_str)
}
