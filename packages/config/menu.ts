import {
  Repeat2,
  SquareTerminal,
  UserCog,
  Construction,
  Grid2X2,
  ArrowDownLeft,
  History,
  ArrowDownLeftFromSquare,
  FileStack,
  Search,
  ArrowUpRight,
} from "lucide-react";

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
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  // teams: [
  //   {
  //     name: "PS Frontend",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Acme Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Evil Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navInventory: [
    {
      name: "Gudang Kain",
      url: "/fabric",
      icon: FileStack,
      role: ["preparist", "checker", "admin"],
    },
    {
      name: "Gudang Kecil",
      url: "/small-inventory",
      icon: Grid2X2,
      role: ["preparist", "checker", "admin"],
    },
    {
      name: "Gudang Besar",
      url: "/large-inventory",
      icon: Grid2X2,
      role: ["preparist", "checker", "admin"],
    },
  ],
  navFabricTransaction: [
    {
      name: "Pembelian Kain",
      url: "/transaction/fabric-purchase",
      icon: Repeat2,
      role: ["preparist", "checker", "admin"],
    },
    {
      name: "Pemotongan Kain",
      url: "/transaction/fabric-cutting",
      icon: Repeat2,
      role: ["preparist", "checker", "admin"],
    },
    {
      name: "Lacak Hasil Potong",
      url: "/transaction/track-cutting",
      icon: Search,
      role: ["preparist", "checker", "admin"],
    },
  ],
  navCMTTransaction: [
    {
      name: "Permintaan",
      url: "/transaction/request",
      icon: Repeat2,
      role: ["preparist", "checker", "admin"],
    },
    {
      name: "Lacak CMT",
      url: "/transaction/track-cmt",
      icon: Search,
      role: ["preparist", "checker", "admin"],
    },
    {
      name: "Penerimaan",
      url: "/transaction/receive",
      icon: ArrowDownLeft,
      role: ["preparist", "checker", "admin"],
    },
    {
      name: "Riwayat penerimaan",
      url: "/transaction/receive-logs",
      icon: History,
      role: ["preparist", "checker", "admin"],
    },
  ],
  navWarehouseMutation: [
    {
      name: "Mutasi",
      url: "/transaction/mutation",
      icon: ArrowDownLeftFromSquare,
      role: ["preparist", "checker", "admin"],
    },
  ],
  navStoreTransaction: [
    {
      name: "Pesanan",
      url: "/transaction/order",
      icon: Repeat2,
      role: ["preparist", "checker"],
    },
    {
      name: "Outbound Manual",
      url: "/transaction/outbound-manual",
      icon: ArrowUpRight,
      role: ["preparist", "admin"],
    },
  ],
  navMaster: [
    {
      title: "Master Data",
      url: "#",
      icon: SquareTerminal,
      role: ["admin", "user"],
      items: [
        {
          title: "Gudang",
          url: "/master-data/warehouse",
          role: ["admin"],
        },
        {
          title: "Rak",
          url: "/master-data/rack",
          role: ["admin"],
        },
        {
          title: "CMT",
          url: "/master-data/cmt",
          role: ["admin"],
        },
        {
          title: "Product",
          url: "/master-data/product",
          role: ["admin"],
        },
        {
          title: "Ukuran",
          url: "/master-data/size",
          role: ["admin"],
        },
        {
          title: "Warna",
          url: "/master-data/color",
          role: ["admin"],
        },
        {
          title: "Model",
          url: "/master-data/product-model",
          role: ["admin"],
        },
        {
          title: "Pabrik",
          url: "/master-data/factory",
          role: ["admin"],
        },
        {
          title: "Ukuran Roll",
          url: "/master-data/roll-size",
          role: ["admin"],
        },
        {
          title: "Toko online",
          url: "/master-data/online-store",
          role: ["admin"],
        },
        {
          title: "Marketplace",
          url: "/master-data/marketplace",
          role: ["admin"],
        },
      ],
    },
    {
      title: "Administrasi",
      url: "#",
      icon: UserCog,
      role: ["admin", "user"],
      items: [
        {
          title: "Pengguna",
          url: "/master-data/user",
          role: ["admin"],
        },
        {
          title: "Peran",
          url: "/master-data/role",
          role: ["admin"],
        },
        {
          title: "ACM",
          url: "/master-data/acm",
          role: ["admin"],
        },
        {
          title: "Audit Log",
          url: "/master-data/audit-log",
          role: ["admin"],
        },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
  tests: [
    {
      name: "Basic CRUD",
      url: "/example",
      icon: Construction,
    },
    {
      name: "Widget Test",
      url: "/example/preview",
      icon: Construction,
    },
  ],
};
