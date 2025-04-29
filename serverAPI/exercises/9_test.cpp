#include <gtest/gtest.h>

TEST(TrocaValoresTest, TrocaCorreta)
{
    extern void troca(int &a, int &b);
    int a = 3, b = 5;
    troca(a, b);
    EXPECT_EQ(a, 5);
    EXPECT_EQ(b, 3);
}