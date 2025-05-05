#include <gtest/gtest.h>
#include "/tmp/code.cpp"

TEST(PotenciaTest, CasosBasicos) {
    EXPECT_EQ(potencia(2, 3), 8);
    EXPECT_EQ(potencia(5, 0), 1);
    EXPECT_EQ(potencia(3, 1), 3);
    EXPECT_EQ(potencia(0, 5), 0);
}

TEST(PotenciaTest, BaseNegativa) {
    EXPECT_EQ(potencia(-2, 2), 4);
    EXPECT_EQ(potencia(-2, 3), -8);
}
