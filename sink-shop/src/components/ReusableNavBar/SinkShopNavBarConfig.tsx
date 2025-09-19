import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useFilter } from "../NavBar/NavBar";
import type { NavBarConfig } from "./AbstractNavBar";
import type { NavigationItem, SearchResult, FilterGroup } from "../SlideMenu";

// Asset imports
import burgerMenuIcon from "../../assets/burger-menu-svgrepo-com.svg";
import paperBagIcon from "../../assets/icons8-paper-bag-50.png";
import searchIcon from "../../assets/search-interface-symbol.png";
import filterIcon from "../../assets/icons8-filter-50.png";

export const useSinkShopNavBarConfig = (): NavBarConfig => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const { currentFilter, setCurrentFilter } = useFilter();

  const cartCount = getCartCount();
  const sinksData = t("sinks", { returnObjects: true }) as Record<string, any>;
  const isHomePage = location.pathname === "/";
  const isCartPage = location.pathname === "/cart";
  const shouldHideSideBar = isHomePage || isCartPage;
  const isCategoryPage =
    location.pathname.startsWith("/category/") || location.pathname === "/products";

  // Navigation links for desktop
  const navigationLinks = useMemo(
    () => [
      {
        to: "/",
        label: t("navigation.home"),
      },
      {
        to: "/products",
        label: t("navigation.allProducts"),
      },
      {
        to: "/category/fossil",
        label: t("categories.fossil"),
        dropdown: [
          {
            to: "/category/fossil/natural",
            label: t("subcategories.natural"),
          },
          {
            to: "/category/fossil/withTabHole",
            label: t("subcategories.withTabHole"),
          },
          {
            to: "/category/fossil/polished",
            label: t("subcategories.polished"),
          },
          {
            to: "/category/fossil",
            label: t("navigation.showAll"),
            className: "border-t border-gray-200 mt-1 pt-2 font-medium",
          },
        ],
      },
      {
        to: "/category/river-stone",
        label: t("categories.riverStone"),
        dropdown: [
          {
            to: "/category/river-stone/natural",
            label: t("subcategories.natural"),
          },
          {
            to: "/category/river-stone/withTabHole",
            label: t("subcategories.withTabHole"),
          },
          {
            to: "/category/river-stone/polished",
            label: t("subcategories.polished"),
          },
          {
            to: "/category/river-stone",
            label: t("navigation.showAll"),
            className: "border-t border-gray-200 mt-1 pt-2 font-medium",
          },
        ],
      },
      {
        to: "/category/marble",
        label: t("categories.marble"),
        dropdown: [
          {
            to: "/category/marble/natural",
            label: t("subcategories.natural"),
          },
          {
            to: "/category/marble/withTabHole",
            label: t("subcategories.withTabHole"),
          },
          {
            to: "/category/marble/polished",
            label: t("subcategories.polished"),
          },
          {
            to: "/category/marble",
            label: t("navigation.showAll"),
            className: "border-t border-gray-200 mt-1 pt-2 font-medium",
          },
        ],
      },
      {
        to: "/category/onyx",
        label: t("categories.onyx"),
        dropdown: [
          {
            to: "/category/onyx/natural",
            label: t("subcategories.natural"),
          },
          {
            to: "/category/onyx/withTabHole",
            label: t("subcategories.withTabHole"),
          },
          {
            to: "/category/onyx/polished",
            label: t("subcategories.polished"),
          },
          {
            to: "/category/onyx",
            label: t("navigation.showAll"),
            className: "border-t border-gray-200 mt-1 pt-2 font-medium",
          },
        ],
      },
    ],
    [t]
  );

  // Mobile navigation items
  const mobileNavigationItems: NavigationItem[] = useMemo(
    () => [
      {
        to: "/",
        label: t("navigation.home"),
        delay: 100,
      },
      {
        to: "/products",
        label: t("navigation.allProducts"),
        delay: 200,
      },
      {
        to: "/category/fossil",
        label: t("categories.fossil"),
        delay: 300,
      },
      {
        to: "/category/river-stone",
        label: t("categories.riverStone"),
        delay: 400,
      },
      {
        to: "/category/marble",
        label: t("categories.marble"),
        delay: 500,
      },
      {
        to: "/category/onyx",
        label: t("categories.onyx"),
        delay: 600,
      },
      {
        to: "/cart",
        label: t("navigation.cart"),
        icon: paperBagIcon,
        badge: cartCount > 0 ? cartCount : undefined,
        delay: 700,
      },
    ],
    [t, cartCount]
  );

  // Search function
  const handleSearch = useMemo(
    () =>
      (query: string): SearchResult[] => {
        if (!query.trim()) return [];

        const searchQuery = query.toLowerCase();
        return Object.keys(sinksData)
          .filter((sinkId) => {
            const sink = sinksData[sinkId];
            return (
              sink.title?.toLowerCase().includes(searchQuery) ||
              sink.description?.toLowerCase().includes(searchQuery) ||
              sink.tag?.toLowerCase().includes(searchQuery) ||
              t(`categories.${sink.category}`)?.toLowerCase().includes(searchQuery)
            );
          })
          .slice(0, 10)
          .map((sinkId) => {
            const sink = sinksData[sinkId];
            return {
              id: sinkId,
              title: sink.title,
              subtitle: sink.description,
              image: sink.image,
              price: `€${sink.priceEur}`,
              onClick: (result) => {
                const id = result.id.replace("sink", "");
                navigate(`/sink/${id}`);
              },
            };
          });
      },
    [sinksData, t, navigate]
  );

  // Filter groups
  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        id: "sort",
        label: t("filters.sortBy"),
        options: [
          {
            id: "price-low-high",
            label: t("filters.priceLowHigh"),
          },
          {
            id: "price-high-low",
            label: t("filters.priceHighLow"),
          },
          {
            id: "newest",
            label: t("filters.newest"),
          },
        ],
      },
    ],
    [t]
  );

  // Action buttons
  const actionButtons = useMemo(
    () => [
      {
        id: "cart",
        icon: paperBagIcon,
        label: t("navigation.cart"),
        onClick: () => navigate("/cart"),
        badge: cartCount > 0 ? cartCount : undefined,
        showOnMobile: false, // Already in mobile menu
        showOnDesktop: true,
      },
    ],
    [t, navigate, cartCount]
  );

  return useMemo(
    () => ({
      logo: {
        text: "Artindo Home",
        to: "/",
        className: "text-xl sm:text-2xl font-bold text-gray-800 hover:text-blue-600",
      },

      links: navigationLinks,
      mobileNavigation: mobileNavigationItems,
      actionButtons,

      search: {
        enabled: !isHomePage,
        placeholder: `${t("navigation.search")}...`,
        icon: searchIcon,
        searchFunction: handleSearch,
        emptyStateMessage: "Start typing to search for sinks...",
        noResultsMessage: "No results found",
      },

      filter: {
        enabled: !isHomePage,
        icon: filterIcon,
        groups: filterGroups,
        selectedFilter: currentFilter,
        onFilterSelect: setCurrentFilter,
        clearFilterLabel: t("filters.clearFilter"),
      },

      menu: {
        icon: burgerMenuIcon,
        title: t("navigation.menu"),
      },

      responsive: {
        hideLinksOnMobile: true,
        mobileBreakpoint: "sm",
      },
    }),
    [
      navigationLinks,
      mobileNavigationItems,
      actionButtons,
      t,
      handleSearch,
      filterGroups,
      currentFilter,
      setCurrentFilter,
      isHomePage,
      isCartPage,
      shouldHideSideBar,
      isCategoryPage,
    ]
  );
};
