#include <gtest/gtest.h>
#include "code.cpp"

TEST(RaizQuadradaTest, CasosBasicos) {
    EXPECT_DOUBLE_EQ(raizQuadrada(4.0), 2.0);
    EXPECT_DOUBLE_EQ(raizQuadrada(0.0), 0.0);
}
