'use client';

type Props = {
  onExampleClick: (value: string) => void;
};

export default function Examples({ onExampleClick }: Props) {
  const examples = [
    "Create a modern login form with email and password fields",
    "Design a pricing card with three tiers",
    "Make a hero section with a call-to-action button"
  ];

  return (
    <div className="text-left max-w-md mx-auto space-y-3">
      <p className="text-sm font-medium text-gray-700 mb-3">Try these examples:</p>
      {examples.map((example, index) => (
        <button
          key={index}
          onClick={() => onExampleClick(example)}
          className="w-full text-left p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700 hover:text-blue-600"
        >
          {example}
        </button>
      ))}
    </div>
  );
}
