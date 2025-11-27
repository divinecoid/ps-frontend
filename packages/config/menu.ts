import { AudioWaveform, BookOpen, Bot, Command, Construction, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";

// export const Menu = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   teams: [
//     {
//       name: "PS Frontend",
//       logo: GalleryVerticalEnd,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Playground",
//       url: "#",
//       icon: SquareTerminal,
//       isActive: true,
//       items: [
//         {
//           title: "History",
//           url: "#",
//         },
//         {
//           title: "Starred",
//           url: "#",
//         },
//         {
//           title: "Settings",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Models",
//       url: "#",
//       icon: Bot,
//       items: [
//         {
//           title: "Genesis",
//           url: "#",
//         },
//         {
//           title: "Explorer",
//           url: "#",
//         },
//         {
//           title: "Quantum",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Documentation",
//       url: "#",
//       icon: BookOpen,
//       items: [
//         {
//           title: "Introduction",
//           url: "#",
//         },
//         {
//           title: "Get Started",
//           url: "#",
//         },
//         {
//           title: "Tutorials",
//           url: "#",
//         },
//         {
//           title: "Changelog",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Settings",
//       url: "#",
//       icon: Settings2,
//       items: [
//         {
//           title: "General",
//           url: "#",
//         },
//         {
//           title: "Team",
//           url: "#",
//         },
//         {
//           title: "Billing",
//           url: "#",
//         },
//         {
//           title: "Limits",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   projects: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: Frame,
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: PieChart,
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: Map,
//     },
//   ],
// }
export const Menu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "PS Frontend",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Master Data",
      url: "#",
      icon: SquareTerminal,
      role: [
        'admin',
        'user'
      ],
      items: [
        {
          title: "User",
          url: "/master-data/user",
          role: [
            'admin'
          ]
        },
        {
          title: "Role",
          url: "/master-data/role",
          role: [
            'admin'
          ]
        },
        {
          title: "Rack",
          url: "/master-data/rack",
          role: [
            'admin'
          ]
        },
        {
          title: "Warehouse",
          url: "/master-data/warehouse",
          role: [
            'admin'
          ]
        },
        {
          title: "CMT",
          url: "/master-data/cmt",
          role: [
            'admin'
          ]
        },
        {
          title: "Inventory",
          url: "/master-data/inventory",
          role: [
            'admin'
          ]
        },
        {
          title: "Product",
          url: "/master-data/product",
          role: [
            'admin'
          ]
        },
        {
          title: "Product Model",
          url: "/master-data/product-model",
          role: [
            'admin'
          ]
        },
        {
          title: "Size",
          url: "/master-data/size",
          role: [
            'admin'
          ]
        },
        {
          title: "Color",
          url: "/master-data/color",
          role: [
            'admin'
          ]
        },
        {
          title: "Factory",
          url: "/master-data/factory",
          role: [
            'admin'
          ]
        },
        {
          title: "Online Store",
          url: "/master-data/online-store",
          role: [
            'admin'
          ]
        },
        {
          title: "Marketplace",
          url: "/master-data/marketplace",
          role: [
            'admin'
          ]
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
  tests: [
    {
      name: "Basic CRUD",
      url: "/example",
      icon: Construction,
    },
  ],
}