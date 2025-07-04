"use server";

import { z } from "zod";
import { initialServers } from "@/lib/mock-data";

const cleanupActionSchema = z.object({
  serverIp: z.string(),
  username: z.string(),
  password: z.string(),
});

type CleanupActionInput = z.infer<typeof cleanupActionSchema>;

/**
 * SIMULATED cleanup script execution.
 * This simulates connecting to a server and running cleanup tasks.
 * The actual `node-winrm` package could not be installed due to network/environment issues.
 */
export async function runCleanupAction(input: CleanupActionInput): Promise<{ stdout?: string; stderr?: string }> {
  const validation = cleanupActionSchema.safeParse(input);
  if (!validation.success) {
    return { stderr: "Неверные входные данные: " + validation.error.message };
  }

  const { serverIp, username, password } = input;

  // Simulate authentication failure
  if (!password) {
    return { stderr: "Аутентификация не удалась. Пароль не может быть пустым." };
  }
  
  // Find server to check its status from the mock data, as we can't fetch it live.
  const server = initialServers.find(s => s.ipAddress === serverIp);

  // Simulate connection failure for offline servers
  if (server && server.status === 'Offline') {
    return { stderr: `[РЕЖИМ СИМУЛЯЦИИ] Сетевая ошибка при подключении к ${serverIp}:5985. Сервер оффлайн.` };
  }

  // Simulate a successful execution with dynamic output
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const freedWinTemp = (Math.random() * 500).toFixed(2);
  const freedUserTemp = (Math.random() * 200).toFixed(2);
  const freedDownloads = (Math.random() * 5000).toFixed(2);
  const totalFreed = ((parseFloat(freedWinTemp) + parseFloat(freedUserTemp) + parseFloat(freedDownloads)) / 1024).toFixed(2);

  const stdout = `
[РЕЖИМ СИМУЛЯЦИИ] - Это не настоящее выполнение.

${now} - Запуск симуляции очистки на сервере ${serverIp}.
${now} - Аутентификация пользователя: ${username}.
${now} - Очистка системной временной папки Windows...
${now} - Очистка временной папки пользователя...
${now} - Очистка файлов старше 30 дней из папки "Загрузки"...
${now} - --------------------------------------------------
${now} - ИТОГИ ОЧИСТКИ
${now} - Освобождено в Windows Temp: ${freedWinTemp} МБ
${now} - Освобождено в User Temp: ${freedUserTemp} МБ
${now} - Освобождено в Загрузках: ${freedDownloads} МБ
${now} - Всего освобождено: ${totalFreed} ГБ.
${now} - Очистка успешно завершена.
${now} - --------------------------------------------------
  `.trim();

  return new Promise((resolve) => {
    setTimeout(() => {
        resolve({ stdout: stdout, stderr: "" });
    }, 1500); // Simulate network and script execution delay
  });
}
