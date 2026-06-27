import React from "react";
import { SCHEME_ITEMS } from "../../data/landing/schemes";
import "./BehaviorCards.css";

interface BehaviorCardsProps {
    isActive: boolean;
    onCardSelect?: (title: string) => void;
}

const behaviorCards = [
    { title: "Farm Discipline", imageIndex: 6 },
    { title: "Digital Agriculture", imageIndex: 1 },
    { title: "Farm Investment", imageIndex: 8 },
    { title: "Market Linkage", imageIndex: 4 },
    { title: "Green Mindset", imageIndex: 9 },
    { title: "Financial Wisdom", imageIndex: 0 },
];

export const BehaviorCards: React.FC<BehaviorCardsProps> = ({ isActive, onCardSelect }) => (
    <section className={`s4-root ${isActive ? "s4-root--active" : ""}`}>
        <div className="s4-watermark" aria-hidden="true">BEHAVIOUR</div>

        <div className="s4-heading">
            <p>Green Krishi / Behaviour Cards</p>
            <h2>
                Behaviour
                <span>Cards</span>
            </h2>
        </div>

        <div className="s4-card-deck" aria-label="Behaviour cards">
            {behaviorCards.map((card, index) => (
                <button
                    key={card.title}
                    type="button"
                    className={`s4-card s4-card--${index + 1}`}
                    style={{ "--card-idx": index } as React.CSSProperties}
                    onClick={() => onCardSelect?.(card.title)}
                >
                    <span className="s4-card-image-wrap">
                        <img
                            src={SCHEME_ITEMS[card.imageIndex]?.src ?? SCHEME_ITEMS[0].src}
                            alt=""
                            className="s4-card-image"
                            draggable={false}
                        />
                    </span>
                    <span className="s4-card-copy">
                        <span>Behaviour Card {String(index + 1).padStart(2, "0")}</span>
                        <strong>{card.title}</strong>
                    </span>
                </button>
            ))}
        </div>
    </section>
);
