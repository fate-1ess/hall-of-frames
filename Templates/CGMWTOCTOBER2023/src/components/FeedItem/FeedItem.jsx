import React from "react";
import { resolveAssetPath } from "../../utils/assetPaths";

const FeedItem = ({ feedImg, feedDate, feedName, feedCopy }) => {
  const resolvedImg = resolveAssetPath(feedImg);
  return (
    <div className="feed">
      <div className="feed-img">
        <img src={resolvedImg} alt="" />
      </div>
      <div className="feed-date">
        <p>{feedDate}</p>
      </div>
      <div className="feed-name">
        <p>{feedName}</p>
        <span className="feed-copy">{feedCopy}</span>
      </div>
    </div>
  );
};

export default FeedItem;
