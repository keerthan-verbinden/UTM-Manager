-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_links" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "landingPageUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "campaign" TEXT NOT NULL,
    "content" TEXT,
    "term" TEXT,
    "generatedUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "campaign_links_userId_idx" ON "campaign_links"("userId");

-- CreateIndex
CREATE INDEX "campaign_links_campaign_idx" ON "campaign_links"("campaign");

-- CreateIndex
CREATE INDEX "campaign_links_source_idx" ON "campaign_links"("source");

-- CreateIndex
CREATE INDEX "campaign_links_medium_idx" ON "campaign_links"("medium");

-- AddForeignKey
ALTER TABLE "campaign_links" ADD CONSTRAINT "campaign_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
