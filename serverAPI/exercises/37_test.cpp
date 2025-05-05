#include <gtest/gtest.h>
#include "code.cpp"

TEST(ArredondarTest, CasosBasicos) {
    EXPECT_EQ(arredondar(3.6), 4);
    EXPECT_EQ(arredondar(2.4), 2);
}
