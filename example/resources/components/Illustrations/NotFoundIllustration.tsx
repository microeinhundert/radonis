/*
 * Not Found Illustration
 */
interface NotFoundIllustrationProps {
  className?: string;
}

function NotFoundIllustration(props: NotFoundIllustrationProps) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 800 800">
      <path d="M678.53 358.9c.52-4.94 1.1-9.87 1.72-14.8.6-4.93 1.24-9.85 1.91-14.76 1.33-9.83 2.73-19.65 4.58-29.39l3.64 5.24-506.3-88.98 6.37-4.41-76.69 410.3-4.05-5.84 507.88 87.83-6.94 4.83 7.62-41.23 7.71-41.21 15.64-82.38 15.89-82.34c5.27-27.45 10.53-54.9 17.25-82.09.27-1.07 1.35-1.73 2.43-1.46.99.25 1.63 1.19 1.51 2.18-3.31 27.81-8.07 55.35-12.83 82.89l-14.2 82.64-14.44 82.6-7.33 41.28-7.42 41.26c-.59 3.25-3.68 5.42-6.94 4.83l-507.53-89.81c-2.72-.48-4.54-3.08-4.06-5.8l.01-.04 75.71-410.48c.55-2.98 3.39-4.96 6.37-4.41l505.95 90.95c2.45.44 4.08 2.78 3.64 5.24-1.71 9.76-3.86 19.44-6.09 29.11-1.11 4.83-2.25 9.66-3.42 14.49-1.16 4.83-2.36 9.64-3.61 14.45-.28 1.07-1.38 1.71-2.45 1.43-1.01-.22-1.63-1.15-1.53-2.12z" />
      <path d="M622.85 340.38c5.08-4.25 10.45-8.06 15.86-11.81 5.44-3.7 10.96-7.26 16.6-10.65 2.8-1.73 5.61-3.43 8.45-5.09 2.82-1.69 5.68-3.32 8.55-4.94 5.74-3.22 11.53-6.37 17.5-9.24 1.25-.6 2.76-.07 3.36 1.18.51 1.06.21 2.31-.66 3.03-5.1 4.23-10.38 8.17-15.71 12.04-2.67 1.93-5.34 3.85-8.06 5.71-2.69 1.89-5.42 3.74-8.15 5.56-5.44 3.7-10.98 7.23-16.62 10.63-5.66 3.35-11.37 6.64-17.35 9.48-1.76.83-3.87.08-4.7-1.68-.7-1.48-.28-3.21.93-4.22zM571.29 643.35c3.13 3.38 6.01 6.94 8.8 10.57 2.79 3.64 5.48 7.34 8.08 11.12 2.6 3.78 5.16 7.58 7.6 11.48 2.45 3.89 4.84 7.83 7.02 11.92.52.99.15 2.21-.84 2.74-.79.42-1.74.26-2.36-.33-3.34-3.22-6.47-6.6-9.53-10.02-3.07-3.42-6.03-6.93-8.95-10.47-2.92-3.54-5.74-7.15-8.47-10.82-2.72-3.68-5.36-7.43-7.74-11.37-1.15-1.9-.54-4.37 1.36-5.52 1.66-1.01 3.76-.67 5.03.7z" />
      <path d="M107.65 619.57l63.97-49.39c.88-.68 1.96-.91 2.97-.73l.12.02L569 640.84l-5.82 4 57.62-302.25 3.24 4.68-395.14-67.9 5.77-4-6.62 35.25-6.69 35.23-13.56 70.43-13.75 70.4c-4.56 23.47-9.26 46.91-14.81 70.2-.32 1.34-1.67 2.17-3.02 1.85-1.26-.3-2.07-1.52-1.9-2.78 3.28-23.71 7.41-47.26 11.68-70.79l12.74-70.59 12.92-70.55 6.55-35.26 6.63-35.24v-.01c.51-2.69 3.08-4.46 5.77-3.99l394.79 69.87c2.18.39 3.64 2.47 3.25 4.65l-.01.03-55.65 302.62c-.5 2.71-3.1 4.5-5.8 4h-.01l-393.93-73.34 3.09-.71-66.33 46.17c-.91.63-2.15.41-2.78-.5-.61-.89-.41-2.09.42-2.74zM424.77 116.88c7.25 6.66 14.42 13.39 21.6 20.11 7.19 6.71 14.37 13.44 21.5 20.21l21.4 20.32 21.32 20.4c14.21 13.6 28.31 27.32 42.46 40.99l10.51 10.35c3.45 3.5 6.96 6.95 10.36 10.51 6.86 7.05 13.63 14.2 20.14 21.62.91 1.04.81 2.63-.23 3.54-.94.82-2.31.82-3.25.05-7.63-6.26-14.99-12.79-22.27-19.42-3.66-3.29-7.23-6.68-10.84-10.01l-10.69-10.17c-14.13-13.69-28.31-27.33-42.36-41.09l-21.09-20.64-21.02-20.72c-7-6.91-13.96-13.86-20.91-20.83-6.95-6.96-13.92-13.91-20.81-20.93-1.16-1.18-1.14-3.08.04-4.24 1.15-1.11 2.97-1.12 4.14-.05zM275.55 225.62c4.82-4.74 9.72-9.37 14.59-14.05l14.74-13.88c9.87-9.21 19.79-18.36 29.79-27.42l15.01-13.57c5-4.53 10.01-9.05 15.07-13.51l15.15-13.42c5.09-4.43 10.15-8.89 15.28-13.27 1.68-1.43 4.21-1.23 5.64.45 1.4 1.64 1.24 4.08-.32 5.53-4.95 4.59-9.97 9.09-14.96 13.63l-15.09 13.48c-5.02 4.51-10.09 8.96-15.17 13.39l-15.23 13.33c-10.16 8.88-20.4 17.67-30.69 26.4l-15.5 13.03c-5.21 4.29-10.39 8.62-15.65 12.86-.86.69-2.12.56-2.82-.31-.65-.79-.56-1.95.16-2.67z" />
      <path d="M230.82 272.74c31.28 17.5 62.04 35.83 92.65 54.41l22.91 14.01 22.85 14.12 45.67 28.26 45.59 28.39L506 440.46c15.15 9.54 30.3 19.08 45.4 28.71 15.11 9.61 30.24 19.18 45.28 28.9 1.16.75 1.49 2.3.74 3.46-.73 1.13-2.22 1.47-3.37.8-15.42-9.1-30.76-18.34-46.12-27.54-15.37-9.18-30.69-18.45-46-27.73l-45.89-27.91-45.8-28.05-45.73-28.17-22.85-14.1-22.79-14.21c-30.32-19.04-60.49-38.34-90.15-58.46-.91-.62-1.15-1.87-.53-2.78.58-.88 1.73-1.14 2.63-.64z" />
      <path d="M332.74 603.99C323.2 576.84 314 549.58 305 522.25c-9.02-27.32-17.79-54.72-26.52-82.14-8.74-27.41-17.38-54.85-25.87-82.35-8.56-27.47-17-54.98-25.22-82.56-.39-1.32.36-2.72 1.68-3.11 1.29-.38 2.64.32 3.08 1.58 9.41 27.19 18.62 54.46 27.69 81.76 9.14 27.28 18.14 54.61 27.04 81.97 8.91 27.36 17.78 54.73 26.4 82.18 8.64 27.44 17.07 54.95 25.17 82.57.47 1.59-.44 3.26-2.04 3.72-1.53.46-3.14-.39-3.67-1.88z" />
      <path d="M174.97 554.7c2.11-2.4 4.25-4.47 6.52-6.54 2.25-2.05 4.56-4.04 6.94-5.93 2.39-1.88 4.84-3.7 7.34-5.44 2.51-1.73 5.07-3.38 7.68-4.96 10.44-6.3 21.71-11.32 33.48-14.76 11.76-3.43 24.02-5.31 36.29-5.35 6.13-.04 12.26.37 18.31 1.2 6.05.88 12.04 2.07 17.89 3.75l-3.57 2c1.12-3.94 2.39-7.62 3.79-11.34 1.39-3.71 2.93-7.35 4.53-10.97 3.25-7.21 6.88-14.27 10.94-21.09 8.08-13.66 17.8-26.48 29.33-37.66 2.86-2.82 5.89-5.47 9-8.02 3.12-2.55 6.32-5 9.66-7.27 6.68-4.52 13.78-8.49 21.24-11.64 14.89-6.37 31.17-9.39 47.17-8.94l-3.44 3.34c.04-2.23.15-4.28.33-6.39.16-2.1.4-4.19.67-6.27.54-4.17 1.27-8.3 2.16-12.41 1.81-8.21 4.27-16.3 7.57-24.1 3.3-7.79 7.37-15.34 12.61-22.1 5.21-6.74 11.52-12.77 18.86-17.07.96-.56 2.19-.24 2.75.72.49.84.31 1.88-.39 2.51l-.01.01c-5.94 5.36-11.07 11.4-15.37 18.01-4.3 6.61-7.92 13.67-10.86 21.05-2.94 7.38-5.29 15.03-7.14 22.81-.94 3.89-1.74 7.82-2.45 11.76-.69 3.92-1.31 7.97-1.72 11.79.04 1.75-1.31 3.21-3.04 3.32l-.4.03c-15.1.95-29.87 4.42-43.45 10.65-6.78 3.13-13.3 6.82-19.42 11.13-6.17 4.25-11.95 9.06-17.4 14.27-10.92 10.39-20.37 22.39-28.65 35.17-4.12 6.41-7.98 13.01-11.51 19.8-1.78 3.38-3.46 6.82-5.09 10.29-.81 1.73-1.59 3.48-2.36 5.23-.76 1.73-1.52 3.54-2.18 5.22l-.1.26c-.54 1.4-2.06 2.13-3.47 1.74-11.44-2.36-23.06-3.47-34.64-3.13-11.57.36-23.07 2.18-34.19 5.39-5.55 1.63-11.04 3.52-16.38 5.79-5.35 2.23-10.59 4.78-15.68 7.6-5.09 2.81-10.05 5.9-14.83 9.24-2.4 1.66-4.76 3.38-7.05 5.18-1.15.9-2.28 1.82-3.39 2.76-1.11.92-2.24 1.9-3.23 2.81l-.06.06c-1.01.94-2.59.88-3.53-.13-.9-.98-.89-2.43-.06-3.38zM369.42 361.89c-.55-5.88-.11-11.59.86-17.31.97-5.71 2.64-11.33 4.99-16.73 2.36-5.37 5.45-10.52 9.4-14.99 3.89-4.5 8.69-8.27 13.99-10.84 1.25-.61 2.75-.09 3.36 1.16.51 1.05.22 2.29-.63 3.01l-.06.05c-4.07 3.47-7.73 7.18-10.84 11.37-.4.51-.77 1.05-1.14 1.58-.37.54-.76 1.06-1.12 1.6-.7 1.1-1.41 2.19-2.05 3.34-1.36 2.24-2.55 4.58-3.65 6.98-2.24 4.78-4.01 9.83-5.51 15-1.47 5.15-2.69 10.53-3.6 15.81l-.02.12c-.19 1.09-1.23 1.83-2.32 1.64-.92-.16-1.58-.91-1.66-1.79zM193.36 460.5c1.41-1.62 2.81-3.02 4.31-4.42 1.49-1.39 3.03-2.71 4.61-3.99 3.17-2.55 6.5-4.9 9.99-7.01 3.48-2.13 7.1-4.04 10.86-5.69 3.74-1.68 7.61-3.09 11.56-4.26s7.99-2.03 12.08-2.64c4.09-.61 8.22-.82 12.35-.86 8.25.12 16.48 1.4 24.24 3.98l-3.53 1.78c.8-2.21 1.63-4.19 2.57-6.22.92-2.01 1.9-3.98 2.94-5.93 2.07-3.89 4.33-7.68 6.78-11.34 2.44-3.67 5.06-7.23 7.86-10.64 2.78-3.43 5.74-6.72 8.86-9.85 6.21-6.29 13.13-11.92 20.58-16.68.92-.61 1.89-1.15 2.84-1.72.96-.55 1.89-1.14 2.87-1.66 1.95-1.05 3.9-2.08 5.91-3 3.97-1.91 8.12-3.46 12.3-4.77 1.06-.33 2.18.26 2.52 1.31.29.94-.13 1.92-.97 2.37l-.04.02c-7.49 4-14.69 8.31-21.39 13.33-3.4 2.44-6.58 5.15-9.77 7.83-1.55 1.4-3.12 2.77-4.61 4.24-1.54 1.4-3 2.9-4.48 4.37-2.9 3.01-5.69 6.13-8.38 9.33-2.67 3.22-5.25 6.53-7.69 9.93-2.44 3.41-4.78 6.89-6.98 10.47-1.12 1.78-2.16 3.6-3.21 5.41-1.02 1.8-2.06 3.7-2.93 5.45 0 1.11-.9 2.01-2.01 2.01-.11 0-.22-.01-.33-.03l-1.19-.2c-7.57-1.29-15.13-2.05-22.69-1.87-3.78.08-7.53.42-11.28.9-.94.12-1.86.3-2.8.44l-1.4.23-1.39.29c-1.86.34-3.7.79-5.54 1.24-3.66.98-7.27 2.15-10.83 3.5-3.55 1.37-7.04 2.92-10.45 4.67-3.41 1.75-6.75 3.65-9.98 5.74-3.22 2.07-6.43 4.35-9.3 6.71l-.09.07c-.85.7-2.11.58-2.82-.27-.62-.75-.59-1.85.05-2.57zM209.27 375.44c1.73-1.67 3.44-2.99 5.29-4.31 1.83-1.29 3.74-2.46 5.71-3.54 3.94-2.14 8.13-3.84 12.49-5.03 4.36-1.2 8.88-1.86 13.42-2.01 4.55-.11 9.11.29 13.58 1.17l-3.89 1.81c.71-1.49 1.39-2.74 2.16-4.05.75-1.3 1.53-2.57 2.33-3.83 1.64-2.49 3.39-4.91 5.25-7.25 3.71-4.69 7.92-9.01 12.61-12.84 4.69-3.81 9.89-7.11 15.57-9.47 2.83-1.17 5.77-2.13 8.76-2.82 3-.65 6.06-1.06 9.12-1.12l-2.76 2.95c.03-.71.09-1.19.16-1.76.07-.55.15-1.09.25-1.62.2-1.07.43-2.12.72-3.15.56-2.07 1.3-4.09 2.22-6.04 1.82-3.88 4.34-7.47 7.48-10.4 1.56-1.47 3.25-2.81 5.05-3.93.88-.6 1.83-1.08 2.75-1.6.96-.45 1.89-.95 2.88-1.32 3.89-1.61 7.96-2.6 12.05-3.12 1.1-.14 2.1.64 2.24 1.73.14 1.07-.6 2.05-1.65 2.22-3.77.64-7.43 1.71-10.81 3.28-.86.36-1.65.85-2.48 1.27-.78.5-1.6.94-2.33 1.49-1.52 1.04-2.91 2.24-4.18 3.54-2.56 2.6-4.56 5.71-5.96 9.07-.7 1.68-1.27 3.43-1.67 5.2-.21.89-.36 1.78-.49 2.67-.06.45-.11.89-.15 1.33-.04.42-.06.92-.06 1.21 0 1.51-1.13 2.75-2.59 2.93l-.17.02c-2.67.43-5.3.96-7.85 1.79-2.57.76-5.06 1.76-7.47 2.94-4.82 2.35-9.35 5.37-13.52 8.87-4.19 3.48-8.02 7.45-11.59 11.65-1.79 2.1-3.47 4.3-5.09 6.55-.82 1.12-1.61 2.25-2.38 3.39-.75 1.13-1.53 2.35-2.17 3.4l-.22.35c-.8 1.26-2.3 1.81-3.67 1.46-3.92-1.01-7.95-1.61-12.01-1.75-4.05-.1-8.13.24-12.13 1.1-4 .84-7.92 2.16-11.65 3.92-1.86.88-3.69 1.85-5.44 2.95-1.73 1.07-3.5 2.31-4.93 3.54l-.09.07c-.84.72-2.1.62-2.82-.22-.69-.76-.63-1.96.13-2.69zM187.08 209.36c4.31 4.89 8.38 9.96 12.35 15.09 2.01 2.55 3.93 5.16 5.9 7.74l5.75 7.84c3.77 5.27 7.51 10.57 11.11 15.96 3.61 5.38 7.14 10.83 10.43 16.44.98 1.67.42 3.82-1.25 4.81-1.5.88-3.39.52-4.47-.78-4.17-5-8.09-10.16-11.93-15.39-3.86-5.21-7.57-10.53-11.25-15.86l-5.43-8.07c-1.76-2.73-3.57-5.41-5.28-8.17-3.48-5.48-6.87-11.02-10.01-16.73-.67-1.22-.23-2.75.99-3.42 1.05-.58 2.33-.33 3.09.54z" />
      <path d="M445.06 405.22l-1.5 116.05c-.01 1.1-.92 1.99-2.03 1.97-1.09-.01-1.96-.89-1.97-1.97l-1.5-116.05c-.02-1.93 1.52-3.52 3.45-3.55 1.93-.02 3.52 1.52 3.55 3.45v.1zM402.5 89.83c1.87-1.36 4.17-2.24 6.57-2.55 2.4-.31 4.89-.07 7.22.65 4.7 1.39 8.74 4.61 11.43 8.72.32.53.67 1.04.95 1.59l.83 1.66c.46 1.15.91 2.31 1.2 3.55.61 2.44.83 5.05.51 7.63-.32 2.58-1.14 5.11-2.41 7.39-1.28 2.27-3 4.29-5 5.91-4.02 3.21-9 4.97-14.17 4.88-2.57-.05-5.15-.57-7.53-1.57-2.39-.99-4.55-2.49-6.35-4.3-1.8-1.81-3.22-3.93-4.25-6.16-.51-1.12-.96-2.25-1.27-3.43-.34-1.17-.57-2.38-.7-3.59-.51-4.87 1.07-10.01 4.42-13.31.88-.87 2.3-.86 3.17.02.58.59.77 1.42.57 2.16l-.04.13c-.97 3.55-1.11 6.8-.46 9.94.31 1.55.83 3.12 1.61 4.51.75 1.39 1.7 2.62 2.82 3.61 2.23 1.98 5.12 3.04 8.07 2.96 2.92-.08 5.97-1.23 8.24-3.07 1.15-.91 2.11-2.03 2.82-3.27.73-1.23 1.22-2.6 1.44-4.02.46-2.83-.16-5.99-1.73-8.77-2.99-5.56-9.34-9.74-16.43-8.12l-.09.02c-.95.22-1.9-.38-2.12-1.33-.17-.73.12-1.44.68-1.84z" />
      <path d="M459.51 544.37c0 13.24-7.47 23.21-17.25 23.98-9.51.75-18.73-9.56-18.1-23.96.61-13.98 7.87-23.11 17.4-23.11 9.53-.01 17.95 9.84 17.95 23.09z" />
      <path d="M452.68 572.5c0 6.18-4.59 10.82-10.58 11.18-5.84.35-11.49-4.46-11.11-11.18.37-6.52 4.83-10.78 10.68-10.78 5.84.01 11.01 4.6 11.01 10.78zM427.83 529.65l-13.34-19.21c-1.04-1.49-.82-3.48.42-4.72l.02-.02 25.24-25.14c.78-.78 2.05-.78 2.83.01.73.73.77 1.88.14 2.67l-22.26 27.81.45-4.74 10.77 20.76c.64 1.23.16 2.74-1.07 3.38-1.12.59-2.49.23-3.2-.8z" />
      <path d="M450.83 527.92l11.39-22.9.63 4.69-22.62-26.43c-.72-.84-.62-2.11.22-2.82.78-.67 1.93-.63 2.67.05l25.51 23.66c1.31 1.22 1.55 3.16.66 4.63l-.04.06-13.15 21.94c-.85 1.42-2.7 1.88-4.12 1.03-1.35-.81-1.83-2.52-1.15-3.91zM456.31 535.19l26.9-11.95-2.5 3.89.69-28.84c.03-1.11.95-1.98 2.05-1.96 1.01.02 1.83.8 1.94 1.77l3.3 28.66c.2 1.71-.82 3.28-2.37 3.84l-.13.05-27.65 10.1c-1.56.57-3.28-.23-3.85-1.79-.53-1.49.19-3.13 1.62-3.77zM424.91 541.73l-26.12-10.57-.19-.08c-1.14-.46-1.82-1.58-1.78-2.75l1.03-30.14c.04-1.1.96-1.97 2.07-1.93 1.06.04 1.9.89 1.93 1.94l.97 30.15-1.97-2.82 26.81 8.69c2.1.68 3.26 2.94 2.57 5.04-.68 2.1-2.94 3.26-5.04 2.57-.1-.03-.19-.06-.28-.1zM428.11 552.57l-29.79 9.37 1.55-1.5-8.83 18.68c-.47 1-1.67 1.43-2.67.95-.95-.45-1.38-1.56-1.01-2.52l7.37-19.3c.24-.62.7-1.1 1.26-1.37l.29-.14 28.17-13.47c2.5-1.19 5.49-.14 6.68 2.36 1.19 2.5.14 5.49-2.36 6.68-.21.1-.44.19-.66.26zM457.86 542.7l32.47 12.97.23.09c.52.21.92.57 1.18 1.02l9.73 16.58c.56.95.24 2.18-.71 2.74-.91.53-2.07.26-2.66-.59l-10.93-15.81 1.41 1.11-33.62-9.58c-2.39-.68-3.78-3.17-3.1-5.57.68-2.39 3.17-3.78 5.57-3.1.14.03.29.08.43.14z" />
      <path d="M432.51 560.37l-12.13 15.07.62-4.01 9 30.58c.31 1.06-.29 2.18-1.36 2.49-.97.29-1.99-.2-2.39-1.1l-13.08-29.06c-.57-1.27-.37-2.7.41-3.74l.21-.28 11.62-15.46c1.49-1.99 4.31-2.39 6.3-.9 1.99 1.49 2.39 4.31.9 6.3-.03.02-.07.07-.1.11zM456.26 555.3l12.71 13.73.17.19c.83.9 1.02 2.17.59 3.24l-12.37 30.47c-.42 1.02-1.58 1.52-2.61 1.1-.97-.4-1.46-1.48-1.15-2.46l9.97-31.34.76 3.43-13.73-12.71c-1.62-1.5-1.72-4.03-.22-5.66 1.5-1.62 4.03-1.72 5.66-.22.07.08.15.16.22.23z" />
    </svg>
  );
}

export default NotFoundIllustration;
