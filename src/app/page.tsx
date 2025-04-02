import {signOut} from "@/auth";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold underline m-5">
        Hello world!
      </h1>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  );
}
