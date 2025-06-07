#include <gtest/gtest.h>
#include "code.cpp"

TEST(QuantasLetrasTest, Basico) {
    EXPECT_EQ(quantasLetras("gato"), 4);
    EXPECT_EQ(quantasLetras("computador"), 10);
}
