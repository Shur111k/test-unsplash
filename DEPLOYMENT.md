# Публікація демо

Для SSR, серверних дій і Supabase Auth обрано Vercel. Код уже містить `build` і `start` для Next.js; окремий `vercel.json` не потрібен.

## 1. Перед публікацією

1. Локально перевірити в акаунті: `/?preview=1` → зберегти фото → `/profile` → видалити → оновити сторінку. Preview доступний лише в режимі розробки й не витрачає Unsplash API.
2. Запустити `npm run lint`, `npm run typecheck`, `npm run test`, `npm run format:check`, `npm run build`.
3. Переглянути `git status` і переконатися, що `.env.local` не відстежується. Закомітити й надіслати зміни до `main` репозиторію `Shur111k/test-unsplash`.

## 2. Імпорт у Vercel

1. У Vercel створити **New Project → Import Git Repository** і вибрати `Shur111k/test-unsplash` під тим GitHub-акаунтом, де є доступ до репозиторію.
2. Framework Preset — **Next.js**, Root Directory — корінь репозиторію, Build Command — стандартний `npm run build`. Node.js — **22.x**.
3. До першого Production Deploy додати в **Project Settings → Environment Variables** для **Production**:

   | Змінна | Значення |
   | --- | --- |
   | `UNSPLASH_ACCESS_KEY` | Access Key застосунку Unsplash, без `NEXT_PUBLIC_` |
   | `SUPABASE_URL` | URL наявного Supabase-проєкту |
   | `SUPABASE_PUBLISH_KEY` | Publishable key того самого проєкту |
   | `APP_ORIGIN` | Точний HTTPS origin сайту, наприклад `https://my-project.vercel.app` |

   Для Preview deployments додати відповідні змінні окремо, якщо планується тестувати їхню авторизацію. `APP_ORIGIN` має відповідати URL, на який повинне повертатися підтвердження email. `DB_PASSWORD`, direct connection string, `service_role` і Supabase secret key не потрібні застосунку й не мають потрапити у Vercel.

4. Запустити Production Deploy. Якщо URL відрізняється від попередньо заданого `APP_ORIGIN`, виправити цю змінну та зробити Redeploy.

## 3. Supabase Auth

У **Supabase Dashboard → Authentication → URL Configuration**:

- `Site URL`: production origin сайту.
- `Redirect URLs`: точне `https://<production-domain>/auth/callback`; зберегти також `http://localhost:3000/auth/callback` для локальної розробки.
- Для preview-адрес додати відповідний wildcard лише якщо вони справді потрібні; production callback краще тримати точним.

Міграцію `supabase/migrations/20261009083238_saved_photos.sql` уже застосовано до поточного Supabase-проєкту. Якщо Vercel підключено до іншого проєкту, застосувати міграцію там перед перевіркою добірки.

## 4. Перевірка після деплою

`npm run smoke -- https://<production-domain>` перевіряє доступність пошуку, авторизації, захист профілю, callback без коду та 404 **без запитів до Unsplash**.

Потім вручну відкрити головну, фото, тег, пошук, реєстрацію, вхід і профіль на телефоні й десктопі; зберегти й видалити справжнє фото. Це вже викличе Unsplash API. Demo-ключ має обмежений ліміт, тому не запускати багато повторних перевірок або автоматичний crawler. Окремо перевірити лист підтвердження: стандартний SMTP Supabase може не надсилати листи адресам поза командою проєкту.

Джерела: [Next.js на Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [версії Node.js у Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [redirect URL в Supabase](https://supabase.com/docs/guides/auth/redirect-urls), [ліміти Unsplash API](https://unsplash.com/documentation).
