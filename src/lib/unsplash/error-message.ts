import { UnsplashApiError } from "./client";

export function photoErrorMessage(error: unknown): string {
  if (error instanceof UnsplashApiError) {
    if (error.kind === "configuration") {
      return "Додайте UNSPLASH_ACCESS_KEY до .env.local, щоб завантажити фотографії.";
    }
    if (error.kind === "rate_limit") {
      return "Ліміт запитів до Unsplash вичерпано. Спробуйте трохи пізніше.";
    }
  }
  return "Не вдалося завантажити фотографії. Спробуйте оновити сторінку пізніше.";
}
