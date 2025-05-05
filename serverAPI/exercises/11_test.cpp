#include <gtest/gtest.h>
#include "/tmp/code.cpp"  // Inclui o vetor e a função

TEST(NotasTest, TamanhoCorreto) {
    EXPECT_EQ(notas.size(), 3);
}

TEST(NotasTest, ValoresEsperados) {
    EXPECT_FLOAT_EQ(notas[0], 5.0f);
    EXPECT_FLOAT_EQ(notas[1], 10.0f);
    EXPECT_FLOAT_EQ(notas[2], 2.0f);
}

TEST(PrimeiraNotaTest, RetornaCorretamente) {
    EXPECT_FLOAT_EQ(primeiraNota(), 5.0f);
}
