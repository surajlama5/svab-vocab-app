# ASVAB Vocab Master

An offline-first ASVAB Word Knowledge and Paragraph Comprehension study app built with Expo, React Native, and TypeScript. The vocabulary library is bundled with the app, so study activities need no account or API.

## Start the app

```sh
npm install
npx expo start
```

Press `i` in Expo CLI to launch an iOS simulator, or scan the QR code with Expo Go. This project uses Expo SDK 58; see the [matching Expo documentation](https://docs.expo.dev/versions/v58.0.0/) for development environment requirements.

## Study areas

- **Home:** session progress, study paths, and a featured Decipher Engine lesson.
- **Roots:** 30 prefixes and roots with meanings and example words.
- **Flashcards:** 108 vocabulary cards with context sentences, definitions, word parts, and Decipher Engine links.
- **Quiz:** ten-question rounds with immediate feedback and session best score.
- **Decipher Engine:** word breakdowns, plain-language clues, and a test-taking routine.

Progress and theme selection are held in memory and reset when the app closes. Bundled content is in `src/data/`; route screens are in `src/app/`.
