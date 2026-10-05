import React, { useState, useEffect, useCallback } from 'react';
import { StatsCards } from '../components/StatsCards.tsx';
import { LinksTable } from '../components/LinksTable.tsx';
import { LinkDetailsModal } from '../components/LinkDetailsModal.tsx';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.tsx';
import { CampaignLink, DashboardStats } from '../types.ts';
import { api } from '../services/api.ts';

interface DashboardPageProps {
  onCreateLinkClick: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onCreateLinkClick,
  showToast,
}) => {
  const [links, setLinks] = useState<CampaignLink[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [mediumFilter, setMediumFilter] = useState('ALL');

  // Modals state
  const [selectedLinkForView, setSelectedLinkForView] = useState<CampaignLink | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<CampaignLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [linksRes, statsRes] = await Promise.all([
        api.getLinks({
          search: searchQuery,
          source: sourceFilter,
          medium: mediumFilter,
        }),
        api.getStats(),
      ]);

      setLinks(linksRes.links || []);
      setStats(statsRes.stats || null);
    } catch (err: any) {
      showToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sourceFilter, mediumFilter, showToast]);

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchData();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteLink(linkToDelete.id);
      showToast('Campaign link deleted successfully', 'success');
      setLinkToDelete(null);
      // Refresh list and stats
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete link', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Summary Cards */}
      <StatsCards stats={stats} isLoading={isLoading && !stats} />

      {/* Links Table */}
      <LinksTable
        links={links}
        isLoading={isLoading}
        searchQuery={searchQuery}
        sourceFilter={sourceFilter}
        mediumFilter={mediumFilter}
        onSearchChange={setSearchQuery}
        onSourceFilterChange={setSourceFilter}
        onMediumFilterChange={setMediumFilter}
        onCreateLinkClick={onCreateLinkClick}
        onViewLink={(link) => setSelectedLinkForView(link)}
        onDeleteLink={(link) => setLinkToDelete(link)}
        showToast={showToast}
      />

      {/* Link Inspector Modal */}
      <LinkDetailsModal
        link={selectedLinkForView}
        onClose={() => setSelectedLinkForView(null)}
        showToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        link={linkToDelete}
        isOpen={!!linkToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setLinkToDelete(null)}
      />
    </div>
  );
};
