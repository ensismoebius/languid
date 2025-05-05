#include <gtest/gtest.h>
#include "code.cpp"

TEST(AbsolutoTest, CasosBasicos) {
    EXPECT_EQ(absoluto(5), 5);
    EXPECT_EQ(absoluto(-5), 5);
    EXPECT_EQ(absoluto(0), 0);
}
