const posts = [
    {
      id: 1,
      title: 'Pothole repair needed on Elm Street near downtown transit hub',
      href: '#',
      description:
        'Multiple potholes on Elm Street between Market and Greene are causing damage to vehicles and creating safety hazards for cyclists. This area serves as a key transit connection point and needs urgent attention to maintain accessibility for public transportation users.',
      date: 'Jan 15, 2024',
      datetime: '2024-01-15',
      category: { title: 'resident', href: '#' },
      author: {
        name: 'Sarah Johnson',
        role: 'Downtown Resident',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      id: 2,
      title: 'Affordable housing analysis for Westside neighborhood redevelopment',
      href: '#',
      description: 'Comprehensive rent/ROI analysis using census data and permit records reveals high affordability pressure in Westside. This report identifies potential DGI Catalyst Grant opportunities for mixed-income development that could leverage NC Commerce incentives while preserving community access.',
      date: 'Jan 12, 2024',
      datetime: '2024-01-12',
      category: { title: 'developer', href: '#' },
      author: {
        name: 'Marcus Chen',
        role: 'Urban Development Consultant',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      id: 3,
      title: 'School infrastructure assessment: Priority zones for capital investment',
      href: '#',
      description:
        'Analysis of school facility conditions across Greensboro using open data from City GIS and NC OneMap. Identifies three priority zones where infrastructure improvements could yield the highest student achievement gains, aligned with Brookings research on targeted capital spending.',
      date: 'Jan 10, 2024',
      datetime: '2024-01-10',
      category: { title: 'official', href: '#' },
      author: {
        name: 'Dr. Patricia Williams',
        role: 'City Planning Department',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      id: 4,
      title: 'Transit accessibility gaps in historically underserved communities',
      href: '#',
      description:
        'Mapping transit routes against census tract data reveals service gaps in East Greensboro neighborhoods. This report uses Open Gate City data to identify where enhanced transit infrastructure could improve labor market participation and local commerce growth.',
      date: 'Jan 8, 2024',
      datetime: '2024-01-08',
      category: { title: 'official', href: '#' },
      author: {
        name: 'James Rodriguez',
        role: 'Transportation Analyst',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      id: 5,
      title: 'Small business opportunity zones: Data-driven location insights',
      href: '#',
      description:
        'Using infrastructure data and market indicators to identify high-potential locations for small business development. Includes analysis of local grant eligibility (Greensboro Chamber programs) and proximity to anchor institutions that drive foot traffic.',
      date: 'Jan 5, 2024',
      datetime: '2024-01-05',
      category: { title: 'developer', href: '#' },
      author: {
        name: 'Lisa Park',
        role: 'Economic Development Researcher',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      id: 6,
      title: 'Park maintenance backlog affecting community health outcomes',
      href: '#',
      description:
        'Residents report deteriorating playground equipment and inadequate lighting in several neighborhood parks. Community input aggregated through the platform shows these parks serve as critical gathering spaces, and improvements could enhance local well-being and property values.',
      date: 'Jan 3, 2024',
      datetime: '2024-01-03',
      category: { title: 'resident', href: '#' },
      author: {
        name: 'Robert Thompson',
        role: 'Community Organizer',
        href: '#',
        imageUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
  ]
  
  export default function ViewTopReports() {
    return (
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">Top Community Reports</h2>
            <p className="mt-2 text-lg/8 text-gray-300">See what residents, officials, and developers are reporting across Greensboro.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-700 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-400">
                    {post.date}
                  </time>
                  <a
                    href={post.category.href}
                    className="relative z-10 rounded-full bg-gray-800/60 px-3 py-1.5 font-medium text-gray-300 hover:bg-gray-800"
                  >
                    {post.category.title}
                  </a>
                </div>
                <div className="group relative grow">
                  <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-gray-300">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-gray-400">{post.description}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
                  <img alt="" src={post.author.imageUrl} className="size-10 rounded-full bg-gray-800" />
                  <div className="text-sm/6">
                    <p className="font-semibold text-white">
                      <a href={post.author.href}>
                        <span className="absolute inset-0" />
                        {post.author.name}
                      </a>
                    </p>
                    <p className="text-gray-400">{post.author.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    )
  }
  