"use client";
import { MainContainer } from "@/components/layout/main-container";
import { Loading } from "@/components/shared/loading";
import { NoData } from "@/components/shared/no-data";
import { TargetEntry } from "@/components/shared/target-entry";
import { useInfiniteScrollObserver } from "@/hooks/useInfiniteScrollObserver";
import { useGetQuestions } from "@/hooks/useQuestionApi";
import { Question } from "@/types/question";
import { Button, Tab, tabClasses, TabList, TabPanel, Tabs } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";
import { useMemo, useRef, useState } from "react";

export default function HomePage() {
  const { authenticated, login } = usePrivy();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data: newQuestionsRaw,
    isPending: isPendingNewQuestions,
    fetchNextPage: fetchNextNew,
    hasNextPage: hasNextNew,
    isFetchingNextPage: isFetchingNextNew,
  } = useGetQuestions("new", currentTabIndex === 0);

  const {
    data: topQuestionsRaw,
    isPending: isPendingTopQuestions,
    fetchNextPage: fetchNextTop,
    hasNextPage: hasNextTop,
    isFetchingNextPage: isFetchingNextTop,
  } = useGetQuestions("top", currentTabIndex === 1);

  const newQuestions = newQuestionsRaw?.pages.flat() || [];
  const topQuestions = topQuestionsRaw?.pages.flat() || [];

  const tabs = useMemo(
    () => [
      {
        label: "new",
        data: newQuestions,
        isPending: isPendingNewQuestions,
        fetchNextPage: fetchNextNew,
        hasNextPage: hasNextNew,
        isFetchingNextPage: isFetchingNextNew,
      },
      {
        label: "top",
        data: topQuestions,
        isPending: isPendingTopQuestions,
        fetchNextPage: fetchNextTop,
        hasNextPage: hasNextTop,
        isFetchingNextPage: isFetchingNextTop,
      },
    ],
    [
      newQuestions,
      topQuestions,
      isPendingNewQuestions,
      isPendingTopQuestions,
      fetchNextNew,
      fetchNextTop,
      hasNextNew,
      hasNextTop,
      isFetchingNextNew,
      isFetchingNextTop,
    ],
  );

  const activeTab = tabs[currentTabIndex];

  useInfiniteScrollObserver({
    targetRef: loadMoreRef,
    fetchNextPage: activeTab.fetchNextPage,
    hasNextPage: activeTab.hasNextPage,
    isFetchingNextPage: activeTab.isFetchingNextPage,
  });

  return (
    <MainContainer
      navbarProps={{
        title: "home",
        endItem: !authenticated && (
          <Button size="sm" onClick={login}>
            Login
          </Button>
        ),
      }}
      noPad
    >
      <Tabs
        value={currentTabIndex}
        onChange={(_e, value) => {
          if (typeof value === "number") {
            setCurrentTabIndex(value);
          }
        }}
        sx={{ bgcolor: "transparent" }}
      >
        <TabList
          sticky="top"
          sx={{
            top: 56,
            justifyContent: "center",
            [`&& .${tabClasses.root}`]: {
              flex: 1,
              bgcolor: "transparent",
              "&:hover": { bgcolor: "transparent" },
              [`&.${tabClasses.selected}`]: { color: "primary.plainColor" },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={tab.label} value={index}>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        {tabs.map((tab, index) => (
          <TabPanel key={index} value={index} sx={{ p: 0 }}>
            {tab.isPending ? (
              <Loading />
            ) : !tab.data || tab.data.length === 0 ? (
              <NoData />
            ) : (
              <>
                {tab.data.map((question: Question) => (
                  <TargetEntry key={question.id} targetType="question" target={question} />
                ))}
                {tab.hasNextPage && <div ref={loadMoreRef} />}
                {tab.isFetchingNextPage && <Loading />}
              </>
            )}
          </TabPanel>
        ))}
      </Tabs>
    </MainContainer>
  );
}
