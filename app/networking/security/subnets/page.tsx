import { PageLayout } from "@/components/page-layout"

export default function SubnetsPage() {
  return (
    <PageLayout title="Subnets" description="Manage your subnets">
      <div className="flex items-center justify-center h-[400px] border rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Subnets</h3>
          <p className="text-muted-foreground">This is a placeholder for the Subnets content</p>
        </div>
      </div>
    </PageLayout>
  )
}
