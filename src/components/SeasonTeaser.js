import React from 'react';

/**
 *
 * @param {string|null} [season_teaser]
 * @param {boolean} [season_active]
 * @return {JSX.Element}
 * @constructor
 */
const SeasonTeaser = ({season_teaser, season_active}) => {
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
