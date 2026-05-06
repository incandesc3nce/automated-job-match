import { Header } from '@/components/common/Header';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { Typography } from '@/components/ui/typography';
import { Briefcase, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center py-16 px-6 gap-24">
        <section className="flex flex-col items-center text-center gap-6 mt-12">
          <Typography tag="h1">
            Ваша карьера начинается{' '}
            <Typography accent tag="span">
              здесь
            </Typography>
          </Typography>
          <Typography
            tag="p"
            className="text-xl text-gray-600 max-w-2xl dark:text-gray-100">
            Создайте свое резюме и получите подборку актуальных вакансий специально для
            вас уже через{' '}
            <Typography tag="span" accent className="font-semibold">
              1 минуту
            </Typography>
          </Typography>
          <div className="flex gap-4 mt-4">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Зарегистрироваться
            </Link>
          </div>
        </section>

        <section className="w-full flex flex-col items-center gap-12">
          <div className="text-center">
            <Typography tag="h2" className="text-3xl font-bold">
              Наши преимущества
            </Typography>
            <Typography className="text-gray-600 dark:text-gray-100 mt-2">
              Всё необходимое для успешного поиска работы
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <FeatureCard
              title="Простое резюме"
              Icon={FileText}
              description="Напишите свою должность, опыт и навыки, а мы подберем под него подходящие вакансии."
            />

            <FeatureCard
              title="Подбор вакансий"
              Icon={Briefcase}
              description="Наш алгоритм анализирует ваши резюме и предлагает наиболее подходящие вакансии на рынке."
            />
          </div>
        </section>

        <section className="w-full bg-blue-50 dark:bg-mist-900 rounded-3xl p-12 text-center flex flex-col items-center gap-6 mb-12">
          <h2 className="text-3xl font-bold">Готовы сделать следующий шаг?</h2>
          <Typography tag='span'>
            Присоединяйтесь к тысячам пользователей, которые уже нашли работу с помощью
            Career AI.
          </Typography>
          <Link
            href="/sign-up"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg mt-2">
            Зарегистрироваться сейчас
          </Link>
        </section>
      </main>

      <footer className="w-full bg-gray-800 text-gray-300 py-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Career AI. Все права защищены.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm hover:text-gray-400 transition-colors">
              О нас
            </Link>
            <Link
              href="#"
              className="text-sm hover:text-gray-400 transition-colors">
              Контакты
            </Link>
            <Link
              href="#"
              className="text-sm hover:text-gray-400 transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
