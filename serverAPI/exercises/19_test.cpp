#include <gtest/gtest.h>

TEST(DobraPorReferenciaTest, ValorDobrado)
{
    extern void dobrar(int &x);
    int valor = 4;
    dobrar(valor);
    EXPECT_EQ(valor, 8);
}
