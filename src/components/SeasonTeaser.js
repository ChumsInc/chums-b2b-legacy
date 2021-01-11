import React from 'react';

const SeasonTeaser = ({season_teaser}) => {
    return (
        <div className="badge badge-light season-teaser">
            <span className="material-icons material-icons-sm mr-1">new_releases</span>{season_teaser}
        </div>
    );
};

export default SeasonTeaser;
