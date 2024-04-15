import ProfileSetupForm from "./ProfileSetupForm";

export default function ProfileSetupPage() {
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <main>
        <div className="bg-accent p-8 rounded-2xl shadow-sm">
          <h1 className="font-bold text-2xl leading-loose mb-4">
            Før du fortsetter
          </h1>
          <ProfileSetupForm />
        </div>
      </main>
    </div>
  );
}
