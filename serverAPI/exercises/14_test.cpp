#include <gtest/gtest.h>

TEST(ContadorVogaisTest, ContaCorreta)
{
    extern int contarVogais(const char *s);
    EXPECT_EQ(contarVogais("banana"), 3);
}
