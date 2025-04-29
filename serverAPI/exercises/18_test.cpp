#include <gtest/gtest.h>

TEST(FuncaoPotenciaTest, PotenciaCorreta)
{
    extern int potencia(int base, int expoente);
    EXPECT_EQ(potencia(2, 3), 8);
}
