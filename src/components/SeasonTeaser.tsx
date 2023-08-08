import React from 'react';

const SeasonTeaser = ({season_teaser, season_active}:{
    season_teaser?: string|null;
    season_active?: boolean|null;
}) => {
    if (!season_teaser || !season_active) {
        return null;
    }
    return (
        <div className="season-teaser mb-1">
            <span className="bi-info-circle-fill me-3 season-teaser--icon" />
            {season_teaser}
        </div>
    );
};

export default SeasonTeaser;
