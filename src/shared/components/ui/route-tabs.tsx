"use client";

import { Tab, TabList, Tabs } from "@mui/joy";
import tabClasses from "@mui/joy/Tab/tabClasses";
import NextLink from "next/link";

type RouteTab = {
  label: string;
  href: string;
  value: string;
};

export function RouteTabs({
  value,
  tabs,
  sticky,
}: {
  value: string;
  tabs: RouteTab[];
  sticky?: boolean;
}) {
  return (
    <Tabs value={value} sx={{ bgcolor: "transparent" }}>
      <TabList
        sticky={sticky ? "top" : undefined}
        sx={{
          top: sticky ? 57 : undefined,
          bgcolor: "background.body",
          justifyContent: "center",
          [`&& .${tabClasses.root}`]: {
            flex: 1,
            minHeight: 44,
            bgcolor: "transparent",
            borderRadius: 0,
            fontSize: 13,
            fontWeight: 700,
            textTransform: "capitalize",
            "&:hover": { bgcolor: "background.level1" },
            [`&.${tabClasses.selected}`]: {
              color: "primary.400",
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} component={NextLink} href={tab.href} value={tab.value}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
