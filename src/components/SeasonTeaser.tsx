import React from 'react';

const SeasonTeaser = ({season_teaser, season_active}:{
    season_teaser?: string|null;
    season_active?: boolean|null;
}) => {
    if (!season_teaser || !season_active) {
        return null;
    }
    return (
        <div className="season-teaser">
            <span className="bi-info-circle-fill me-3 season-teaser--icon" />
            {season_teaser}
        </div>
    );
};

export default SeasonTeaser;
