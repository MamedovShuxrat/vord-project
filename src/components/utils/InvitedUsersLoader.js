import React from 'react';
import ContentLoader from "react-content-loader";

const InvitedUsersLoader = () => (
    <ContentLoader
        speed={2}
        width={400}
        height={50}
        viewBox="0 0 400 50"
        backgroundColor="#9d2fed"
        foregroundColor="#fff"
    >
        <rect x="55" y="29" rx="3" ry="3" width="140" height="8" />
        <rect x="55" y="14" rx="3" ry="3" width="160" height="9" />
        <rect x="300" y="14" rx="3" ry="3" width="90" height="22" />
        <circle cx="27" cy="26" r="20" />
    </ContentLoader>
);

export default InvitedUsersLoader;
