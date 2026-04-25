import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="mx-auto flex min-h-svh w-[1126px] max-w-full flex-col border-x border-[var(--border)] text-center">
      <section className="flex flex-grow flex-col items-center justify-center gap-[25px] max-lg:gap-[18px] max-lg:px-5 max-lg:pt-8 max-lg:pb-6">
        <div className="relative">
          <img
            src={heroImg}
            className="relative z-0 mx-auto w-[170px]"
            width="170"
            height="179"
            alt=""
          />
          <img
            src={reactLogo}
            className="absolute top-[34px] right-0 left-0 z-[1] mx-auto h-7"
            alt="React logo"
            style={{
              transform:
                'perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg) scale(1.4)',
            }}
          />
          <img
            src={viteLogo}
            className="absolute top-[107px] right-0 left-0 z-0 mx-auto h-[26px] w-auto"
            alt="Vite logo"
            style={{
              transform:
                'perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg) scale(0.8)',
            }}
          />
        </div>
        <div>
          <h1 className="my-8 text-[56px] font-medium tracking-[-1.68px] text-[var(--text-h)] max-lg:my-5 max-lg:text-4xl">
            Get started
          </h1>
          <p>
            Edit{' '}
            <code className="inline-flex rounded bg-[var(--code-bg)] px-2 py-1 font-[family-name:var(--mono)] text-[15px] leading-[135%] text-[var(--text-h)]">
              src/App.tsx
            </code>{' '}
            and save to test{' '}
            <code className="inline-flex rounded bg-[var(--code-bg)] px-2 py-1 font-[family-name:var(--mono)] text-[15px] leading-[135%] text-[var(--text-h)]">
              HMR
            </code>
          </p>
        </div>
        <button
          type="button"
          className="mb-6 inline-flex rounded border-2 border-transparent bg-[var(--accent-bg)] px-2.5 py-[5px] font-[family-name:var(--mono)] text-base text-[var(--accent)] transition-[border-color] duration-300 hover:border-[var(--accent-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="relative w-full before:absolute before:top-[-4.5px] before:left-0 before:border-[5px] before:border-solid before:border-transparent before:border-l-[var(--border)] before:content-[''] after:absolute after:top-[-4.5px] after:right-0 after:border-[5px] after:border-solid after:border-transparent after:border-r-[var(--border)] after:content-['']"></div>

      <section className="flex border-t border-[var(--border)] text-left max-lg:flex-col max-lg:text-center">
        <div
          className="flex-1 border-r border-[var(--border)] p-8 max-lg:border-r-0 max-lg:border-b max-lg:p-6 max-lg:px-5"
          id="docs"
        >
          <svg
            className="mb-4 h-[22px] w-[22px]"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2 className="mb-2 text-2xl leading-[118%] font-medium tracking-[-0.24px] text-[var(--text-h)] max-lg:text-xl">
            Documentation
          </h2>
          <p>Your questions, answered</p>
          <ul className="mt-8 flex list-none gap-2 p-0 max-lg:mt-5 max-lg:flex-wrap max-lg:justify-center">
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a
                href="https://vite.dev/"
                target="_blank"
                className="flex items-center gap-2 rounded-md bg-[var(--social-bg)] px-3 py-1.5 text-base text-[var(--text-h)] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center"
              >
                <img className="h-[18px]" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a
                href="https://react.dev/"
                target="_blank"
                className="flex items-center gap-2 rounded-md bg-[var(--social-bg)] px-3 py-1.5 text-base text-[var(--text-h)] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center"
              >
                <img className="h-[18px]" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-1 p-8 max-lg:p-6 max-lg:px-5" id="social">
          <svg
            className="mb-4 h-[22px] w-[22px]"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2 className="mb-2 text-2xl leading-[118%] font-medium tracking-[-0.24px] text-[var(--text-h)] max-lg:text-xl">
            Connect with us
          </h2>
          <p>Join the Vite community</p>
          <ul className="mt-8 flex list-none gap-2 p-0 max-lg:mt-5 max-lg:flex-wrap max-lg:justify-center">
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                className="flex items-center gap-2 rounded-md bg-[var(--social-bg)] px-3 py-1.5 text-base text-[var(--text-h)] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center"
              >
                <svg
                  className="h-[18px] w-[18px] dark:brightness-200 dark:invert"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a
                href="https://chat.vite.dev/"
                target="_blank"
                className="flex items-center gap-2 rounded-md bg-[var(--social-bg)] px-3 py-1.5 text-base text-[var(--text-h)] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center"
              >
                <svg
                  className="h-[18px] w-[18px] dark:brightness-200 dark:invert"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a
                href="https://x.com/vite_js"
                target="_blank"
                className="flex items-center gap-2 rounded-md bg-[var(--social-bg)] px-3 py-1.5 text-base text-[var(--text-h)] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center"
              >
                <svg
                  className="h-[18px] w-[18px] dark:brightness-200 dark:invert"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
                className="flex items-center gap-2 rounded-md bg-[var(--social-bg)] px-3 py-1.5 text-base text-[var(--text-h)] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center"
              >
                <svg
                  className="h-[18px] w-[18px] dark:brightness-200 dark:invert"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="relative w-full before:absolute before:top-[-4.5px] before:left-0 before:border-[5px] before:border-solid before:border-transparent before:border-l-[var(--border)] before:content-[''] after:absolute after:top-[-4.5px] after:right-0 after:border-[5px] after:border-solid after:border-transparent after:border-r-[var(--border)] after:content-['']"></div>

      <section className="h-[88px] border-t border-[var(--border)] max-lg:h-12"></section>
    </div>
  )
}

export default App
