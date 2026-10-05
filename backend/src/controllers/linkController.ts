import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { dbService } from '../services/db.js';
import { generateTrackingUrl } from '../utils/utmNormalizer.js';

export const createLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { landingPageUrl, source, medium, campaign, content, term } = req.body;

    if (!landingPageUrl) {
      res.status(400).json({ error: 'Landing page URL is required' });
      return;
    }

    if (!campaign || typeof campaign !== 'string' || !campaign.trim()) {
      res.status(400).json({ error: 'Campaign name is required' });
      return;
    }

    if (!source || typeof source !== 'string' || !source.trim()) {
      res.status(400).json({ error: 'Source is required' });
      return;
    }

    if (!medium || typeof medium !== 'string' || !medium.trim()) {
      res.status(400).json({ error: 'Medium is required' });
      return;
    }

    // Generate normalized tracking URL
    let generatedResult;
    try {
      generatedResult = generateTrackingUrl({
        landingPageUrl,
        source,
        medium,
        campaign,
        content,
        term,
      });
    } catch (urlErr: any) {
      res.status(400).json({ error: urlErr.message || 'Invalid URL parameters' });
      return;
    }

    // Save to database
    const link = await dbService.createLink({
      userId: req.user.id,
      landingPageUrl: landingPageUrl.trim(),
      source: generatedResult.source,
      medium: generatedResult.medium,
      campaign: generatedResult.campaign,
      content: generatedResult.content || null,
      term: generatedResult.term || null,
      generatedUrl: generatedResult.generatedUrl,
    });

    res.status(201).json({
      message: 'Campaign link created and saved successfully',
      link,
    });
  } catch (error: any) {
    console.error('Create link error:', error);
    res.status(500).json({ error: error.message || 'Failed to create campaign link' });
  }
};

export const getLinks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { search, source, medium } = req.query;

    const links = await dbService.getLinks(req.user.id, {
      search: typeof search === 'string' ? search : undefined,
      source: typeof source === 'string' ? source : undefined,
      medium: typeof medium === 'string' ? medium : undefined,
    });

    res.status(200).json({ links });
  } catch (error: any) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Failed to retrieve campaign links' });
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const stats = await dbService.getStats(req.user.id);
    res.status(200).json({ stats });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
};

export const getLinkById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const link = await dbService.getLinkById(id, req.user.id);

    if (!link) {
      res.status(404).json({ error: 'Link not found or access denied' });
      return;
    }

    res.status(200).json({ link });
  } catch (error: any) {
    console.error('Get link by id error:', error);
    res.status(500).json({ error: 'Failed to retrieve link' });
  }
};

export const deleteLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const deleted = await dbService.deleteLink(id, req.user.id);

    if (!deleted) {
      res.status(404).json({ error: 'Link not found or access denied' });
      return;
    }

    res.status(200).json({ message: 'Campaign link deleted successfully' });
  } catch (error: any) {
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Failed to delete campaign link' });
  }
};
