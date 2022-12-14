import React from 'react';

const SeasonTeaser = ({season_teaser}) => {
    return (
        <div className="season-teaser">
            {!!season_teaser && (
                <>
                    <span className="bi-info-circle-fill me-3 season-teaser--icon" />
                    {season_teaser}
                </>
            )}
        </div>
    );
};

export default SeasonTeaser;
