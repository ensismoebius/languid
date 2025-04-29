#include <gtest/gtest.h>

TEST(ProdutoEscalarTest, ValorCorreto)
{
    extern int produtoEscalar(const int *a, const int *b, int n);
    int v1[3] = {1, 2, 3};
    int v2[3] = {4, 5, 6};
    EXPECT_EQ(produtoEscalar(v1, v2, 3), 32);
}
