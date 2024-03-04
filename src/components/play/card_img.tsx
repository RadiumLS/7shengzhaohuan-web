import { idToShareId } from "@gi-tcg/utils";

const CardImg: React.FC<{ definitionId: number }> = ({ definitionId }) => {
  const shareId = idToShareId(definitionId);
  return <img src={`/static/cards/${shareId}.png`} style={{
      width: '100%',
      height: '100%',
    }}>
  </img>;
}

export default CardImg;