#include <gtest/gtest.h>
#include "code.cpp"

TEST(PotenciaTest, CasosBasicos) {
    EXPECT_DOUBLE_EQ(potencia(2.0, 3.0), 8.0);
    EXPECT_DOUBLE_EQ(potencia(4.0, 0.5), 2.0);
}
