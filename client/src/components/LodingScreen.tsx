export interface LoadingScreenProps {
  description?: string;
}

export default function LoadingScreen(props: LoadingScreenProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden opacity-75 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#222323' }}
    >
      <img className="-ml-5" src={`${process.env.PUBLIC_URL}/loading.gif`} />
      <h2 className="text-center -mt-5 text-white text-xl font-semibold">
        Loading...
      </h2>
      <p className="w-1/3 text-center text-white">
        {props.description ??
          `This may take a few seconds, please don't close this page.`}
      </p>
    </div>
  );
}
