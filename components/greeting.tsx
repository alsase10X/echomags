import { motion } from "framer-motion";

type GreetingProps = {
  imageAlt?: string;
  imageSrc?: string;
};

export const Greeting = ({ imageSrc, imageAlt }: GreetingProps) => {
  const resolvedImageSrc =
    imageSrc ?? process.env.NEXT_PUBLIC_GREETING_IMAGE_SRC ?? "/images/greeting.png";
  const resolvedImageAlt =
    imageAlt ?? process.env.NEXT_PUBLIC_GREETING_IMAGE_ALT ?? "Greeting illustration";
  const bubbleClasses = [
    "w-full",
    "max-w-md",
    "rounded-3xl",
    "border",
    "border-blue-200/60",
    "bg-white",
    "px-6",
    "py-4",
    "text-zinc-900",
    "shadow-lg",
  ];
  bubbleClasses.push(resolvedImageSrc ? "-mt-2" : "mt-2");

  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col items-center justify-center px-4 text-center md:mt-16 md:px-8"
      key="overview"
    >
      <div className="flex w-full max-w-md flex-col items-center">
        {resolvedImageSrc ? (
          <div className="flex w-full justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={resolvedImageAlt}
              className="h-auto w-full max-w-[220px] object-contain md:max-w-[260px]"
              src={resolvedImageSrc}
            />
          </div>
        ) : null}
        <div className={bubbleClasses.join(" ")}>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="font-semibold text-lg text-zinc-900 md:text-xl"
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
          >
            Hola, soy la inteligencia artificial de Vincent van Gogh
          </motion.div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-base text-zinc-900 md:text-lg"
            exit={{ opacity: 0, y: 10 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.6 }}
          >
            {"Imagino que est\u00E1s aqu\u00ED porque quieres saber m\u00E1s de m\u00ED. Como por ejemplo..."}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
