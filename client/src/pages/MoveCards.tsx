// import { useRef, useState } from 'react';
// import { useSetRecoilState } from 'recoil';
// import { moveCardsAtom } from '../store/atoms/moveAtom';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Card {
//   id: string;
//   title: string;
//   sectionId: string | null; // null = unsorted pool
// }

// interface Section {
//   id: string;
//   title: string;
// }


// const INITIAL_SECTIONS: Section[] = [
//   { id: 'section-1', title: 'Section 1' },
//   { id: 'section-2', title: 'Section 2' },
//   { id: 'section-3', title: 'Section 3' },
//   { id: 'section-4', title: 'Section 4' },
// ];

// const INITIAL_CARDS: Card[] = [
//   { id: 'card-1', title: 'Card A', sectionId: null },
//   { id: 'card-2', title: 'Card B', sectionId: null },
//   { id: 'card-3', title: 'Card C', sectionId: null },
//   { id: 'card-4', title: 'Card D', sectionId: null },
//   { id: 'card-5', title: 'Card E', sectionId: null },
// ];


// const MoveCards = () => {
//   const setMoveCardModal = useSetRecoilState(moveCardsAtom);

//   const [sections] = useState<Section[]>(INITIAL_SECTIONS);
//   const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
//   const [overZone, setOverZone] = useState<string | null>(null);
//   const draggingCardId = useRef<string | null>(null);

//   const cardsInPool = cards.filter((c) => c.sectionId === null);
//   const cardsInSection = (sectionId: string) =>
//     cards.filter((c) => c.sectionId === sectionId);

//   const onDragStart = (cardId: string) => {
//     draggingCardId.current = cardId;
//   };

//   const onDragEnd = () => {
//     draggingCardId.current = null;
//     setOverZone(null);
//   };

//   const onDragOver = (e: React.DragEvent, zoneId: string) => {
//     e.preventDefault(); // required to allow drop
//     setOverZone(zoneId);
//   };

//   const onDragLeave = () => {
//     setOverZone(null);
//   };

//   const onDrop = (e: React.DragEvent, targetSectionId: string | null) => {
//     e.preventDefault();
//     const cardId = draggingCardId.current;
//     if (!cardId) return;

//     setCards((prev) =>
//       prev.map((c) => (c.id === cardId ? { ...c, sectionId: targetSectionId } : c))
//     );
//     setOverZone(null);
//   };

//   const removeFromSection = (cardId: string) => {
//     setCards((prev) =>
//       prev.map((c) => (c.id === cardId ? { ...c, sectionId: null } : c))
//     );
//   };

//   const handleSave = () => {
//     console.log('Saved card assignments:', cards);
//     setMoveCardModal(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//       <div className="flex flex-col gap-4 w-full max-w-6xl h-3/4 rounded-2xl border border-neutral-600 bg-gray-100 p-5">

//         <div className="grid grid-cols-2 gap-4">
          
//           <div
//             className={`flex flex-col gap-2 rounded-xl border bg-neutral-200 p-4 h-119  overflow-y-auto transition-colors ${
//               overZone === 'pool'
//                 ? 'border-zinc-500/60 bg-zinc-250/20'
//                 : 'border-zinc-700/30'
//             }`}
//             onDragOver={(e) => onDragOver(e, 'pool')}
//             onDragLeave={onDragLeave}
//             onDrop={(e) => onDrop(e, null)}
//           >
//             <p className="text-sm uppercase tracking-widest text-neutral-900 mb-1">
//               Unsorted cards
//             </p>

//             {cardsInPool.length === 0 && (
//               <p className="text-center text-sm text-neutral-600 py-4">
//                 All cards assigned
//               </p>
//             )}

//             {cardsInPool.map((card) => (
//               <div
//                 key={card.id}
//                 draggable
//                 onDragStart={() => onDragStart(card.id)}
//                 onDragEnd={onDragEnd}
//                 className="flex flex-col items-start justify-between gap-2 rounded-lg border border-zinc-200/30 bg-gray-50 px-3 py-2.5 cursor-grab select-none transition-colors hover:border-zinc-600/50 hover:bg-gray-100 active:opacity-60"
//               >
//                 <p className="text-md text-neutral-700 font-semibold">{card.title}</p>
//                 <p className="text-md text-neutral-700 font-semibold">http:asdasdw</p>
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-col gap-3 overflow-y-auto max-h-[440px]">
//             {sections.map((section) => {
//               const sectionCards = cardsInSection(section.id);
//               const isOver = overZone === section.id;

//               return (
//                 <div
//                   key={section.id}
//                   className={`rounded-xl border bg-neutral-200 p-4 transition-colors ${
//                     isOver
//                       ? 'border-zinc-500/60 bg-zinc-950/20'
//                       : 'border-zinc-700/30'
//                   }`}
//                   onDragOver={(e) => onDragOver(e, section.id)}
//                   onDragLeave={onDragLeave}
//                   onDrop={(e) => onDrop(e, section.id)}
//                 >
//                   <p className="text-sm text-zinc-400/80 font-medium mb-2">
//                     {section.title}
//                   </p>

//                   <div className="flex flex-col gap-2 min-h-8">
//                     {sectionCards.length === 0 && (
//                       <p className="text-center text-sm text-neutral-600 py-1">
//                         Drop cards here
//                       </p>
//                     )}

//                     {sectionCards.map((card) => (
//                       <div
//                         key={card.id}
//                         draggable
//                         onDragStart={() => onDragStart(card.id)}
//                         onDragEnd={onDragEnd}
//                         className="flex items-start justify-between gap-2 rounded-lg border border-zinc-200/30 bg-gray-50 px-3 py-2.5 cursor-grab select-none transition-colors hover:border-zinc-600/50 hover:bg-gray-100 active:opacity-60"
//                       >
//                         <span className="text-md text-neutral-700 font-semibold">{card.title}</span>
//                         <button
//                           onClick={() => removeFromSection(card.id)}
//                           className="text-zinc-400/60 text-sm px-1.5 py-0.5 rounded hover:bg-zinc-400/10 hover:text-zinc-400 transition-colors"
//                           aria-label="Remove from section"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 pt-1">
//           <button
//             className="rounded-lg font-semibold bg-neutral-300/40 border border-neutral-700 px-6 py-2 text-md text-neutral-500 hover:text-neutral-100 transition-all hover:bg-neutral-400 hover:border-neutral-500 cursor-pointer scale-105 transform "
//             onClick={() => setMoveCardModal(false)}
//           >
//             Cancel
//           </button>
//           <button
//             className="rounded-lg font-semibold bg-purple-300/40 border border-purple-700 px-6 py-2 text-md text-purple-500 hover:text-purple-100 transition-all hover:bg-purple-400 hover:border-purple-500 cursor-pointer scale-105 transform "
//             onClick={handleSave}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MoveCards;