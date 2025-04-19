import { formatDate } from "@/lib/utils";

const GameCard = ({ post }: { post: GameCardType }) => {
  return (
    <li className="game-card group">
      <div className="flex-between">
        <p className="game-card_date">{formatDate(post._createdAt)}</p>
      </div>
    </li>
  );
};

export default GameCard;
