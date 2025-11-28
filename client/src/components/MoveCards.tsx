import React, { useState } from 'react';
import { X, GripVertical } from 'lucide-react';
import { moveAtom } from '../store/atoms/moveAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

interface Card {
  id: string;
  title: string;
  link: string;
}

interface Section {
  id: string;
  name: string;
  cards: Card[];
}

const MoveCards = () => {
  const isOpen = useRecoilValue(moveAtom)
  const setIsOpen = useSetRecoilState(moveAtom)
  const [availableCards, setAvailableCards] = useState<Card[]>([
    { id: '1', title: 'Learn React Hooks', link: 'https://react.dev' },
    { id: '2', title: 'TypeScript Basics', link: 'https://typescriptlang.org' },
    { id: '3', title: 'Tailwind CSS Guide', link: 'https://tailwindcss.com' },
    { id: '4', title: 'Framer Motion API', link: 'https://framer.com/motion' },
    { id: '5', title: 'CSS Grid Mastery', link: 'https://css-tricks.com' },
    { id: '6', title: 'CSS Grid Mastery', link: 'https://css-tricks.com' },
    { id: '7', title: 'CSS Grid Mastery', link: 'https://css-tricks.com' },
    { id: '8', title: 'CSS Grid Mastery', link: 'https://css-tricks.com' },
  ]); 

  const [sections, setSections] = useState<Section[]>([
    { id: 'study', name: 'Study', cards: [] },
    { id: 'adhoc', name: 'Ad Hoc', cards: [] },
    { id: 'youtube', name: 'Youtube', cards: [] },
    { id: 'tweets', name: 'Tweets', cards: [] },
  ]);

  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, card: Card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (sectionId: string) => {
    setDragOverSection(sectionId);
  };

  const handleDragLeave = () => {
    setDragOverSection(null);
  };

  const handleDropOnSection = (sectionId: string) => {
    if (!draggedCard) return;

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, cards: [...section.cards, draggedCard] }
          : section
      )
    );

    setAvailableCards((prev) => prev.filter((card) => card.id !== draggedCard.id));
    setDraggedCard(null);
    setDragOverSection(null);
  };

  const moveCardBack = (card: Card, sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, cards: section.cards.filter((c) => c.id !== card.id) }
          : section
      )
    );
    setAvailableCards((prev) => [...prev, card]);
  };

  return (
    <div className='z-40'>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Organize Cards</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition duration-150"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Section - Available Cards */}
              <div className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Cards</h3>
                <div className="space-y-3">
                  {availableCards.length > 0 ? (
                    availableCards.map((card) => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        className="p-4 bg-white border-2 border-gray-300 rounded-lg cursor-grab active:cursor-grabbing hover:border-neutral-400 hover:shadow-md transition duration-150 group"
                      >
                        <div className="flex items-start gap-3">
                          <GripVertical size={18} className="text-gray-400 mt-1 group-hover:text-gray-600 transition duration-150" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{card.title}</p>
                            <a
                              href={card.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-black hover:underline truncate block"
                            >
                              {card.link}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">All cards have been moved</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Sections */}
              <div className="w-1/2 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      onDragOver={handleDragOver}
                      onDragEnter={() => handleDragEnter(section.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={() => handleDropOnSection(section.id)}
                      className={`bg-gray-50 border-2 border-dashed rounded-lg p-4 min-h-[300px] transition duration-150 ${
                        dragOverSection === section.id
                          ? 'border-neutral-500 bg-neutral-50'
                          : 'border-gray-300 hover:border-neutral-400'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">{section.name}</h4>
                      <div className="space-y-2">
                        {section.cards.length > 0 ? (
                          section.cards.map((card) => (
                            <div
                              key={card.id}
                              className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm group hover:shadow-md transition duration-150"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm truncate">{card.title}</p>
                                  <a
                                    href={card.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-neutral-600 hover:underline truncate block"
                                  >
                                    {card.link}
                                  </a>
                                </div>
                                <button
                                  onClick={() => moveCardBack(card, section.id)}
                                  className="opacity-0 group-hover:opacity-100 transition duration-150 text-gray-400 hover:text-red-600 shrink-0"
                                  title="Move back"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 text-center py-8">Drag cards here</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-900 transition duration-150"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveCards;