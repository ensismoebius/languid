#include <gtest/gtest.h>
#include "code.cpp"

TEST(DobraTest, ValorDobradoCorretamente) {
    int x = 4;
    dobra(x);
    EXPECT_EQ(x, 8);
}

TEST(DobraTest, ZeraValorNegativo) {
    int x = -3;
    dobra(x);
    EXPECT_EQ(x, -6);
}

TEST(DobraTest, ZeroPermaneceZero) {
    int x = 0;
    dobra(x);
    EXPECT_EQ(x, 0);
}
