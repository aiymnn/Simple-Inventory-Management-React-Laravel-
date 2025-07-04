import PortalFooter from '@/components/portal/portal-footer';
import PortalHeader from '@/components/portal/portal-header';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const PortalLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
            <PortalHeader />

            <main className="flex-1 pt-20 sm:pt-24">{children}</main>

            <PortalFooter />
        </div>
    );
};

export default PortalLayout;
