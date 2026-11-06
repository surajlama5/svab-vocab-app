# ASVAB Vocab Master

An offline-first ASVAB study app built with Expo Router, React Native, and TypeScript. Bundled question and vocabulary data keeps practice available without an account, database, or external API.

## Run locally

```sh
npm install
npm run web
```

The app also supports Expo's iOS and Android development workflows. It uses Expo SDK 58; see the [SDK 58 docs](https://docs.expo.dev/versions/v58.0.0/) for environment requirements.

## Learning features

- **Dashboard:** daily question/card goal, study streak, weekly activity, best accuracy, mastered words, recent quiz results, and recommended next practice.
- **Word Knowledge:** randomized multiple-choice rounds, selectable 5 or 10 question lengths, timed and untimed modes, instant feedback, missed-word notebook, and spaced review intervals.
- **Paragraph Comprehension, Arithmetic Reasoning, Mathematics Knowledge:** original locally bundled practice questions using the same quiz flow. They are study questions, not official ASVAB questions.
- **Flashcards:** 108 vocabulary cards, search by word or definition, saved words, missed-word filtering, and Decipher Engine links.
- **Roots:** 30 prefixes and roots with meanings and example words.
- **Guest progress:** bookmarks, review state, daily goals, quiz history, activity, streaks, and best score are stored in browser `localStorage` on the current device and browser.

## Project structure

- `src/app/`: Expo Router screens.
- `src/data/`: bundled vocabulary, word parts, subject metadata, and original practice questions.
- `src/state/StudyStateProvider.tsx`: study state, quiz history, review scheduling, and browser persistence.
- `src/utils/`: round generation and progress calculations.
- `tests/`: lightweight Node tests for learning logic and question data.

## Quality checks

```sh
npm test
npx expo lint
npx tsc --noEmit
npm run build:web
```

## Deploy to Vercel

The repository includes `vercel.json`; its web build runs `npm run build:web` and publishes `dist/`. Connect the Git repository to a Vercel project and use the existing configuration, or run the Vercel CLI from the project after authenticating. No environment variables or database migrations are required. Progress remains local to each browser; cross-device synchronization would require a backend and user accounts.
